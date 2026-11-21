import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import QRCode from "qrcode";
import { classifyQueueWaits, type WaitCategory } from "./queueWait";

type Checkout = {
  id: number;
  number: number;
  open: boolean;
  people: number;
  products: number;
  waitSeconds: number | null;
  updatedAt: string;
};
type Board = {
  checkouts: Checkout[];
  recommendedId: number | null;
  fetchedAt: string;
};
type Mode = "customer" | "simulation";

const waitLabels: Record<WaitCategory, string> = {
  short: "Menor espera",
  medium: "Espera intermediária",
  long: "Maior espera",
};
const number = (value: number) => String(value).padStart(2, "0");
const time = (date: string) => new Date(date).toLocaleTimeString("pt-BR");
const quantity = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`;
const duration = (seconds: number) =>
  seconds === 0
    ? "Caixa Livre"
    : `${Math.floor(seconds / 60)} min${seconds % 60 ? ` ${seconds % 60} s` : ""}`;

export default function App() {
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<Mode>("customer");
  const [qr, setQr] = useState("");
  const [selected, setSelected] = useState(1);
  const [people, setPeople] = useState("2");
  const [products, setProducts] = useState("40");
  const [open, setOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [saveFailed, setSaveFailed] = useState(false);
  const inFlight = useRef(false);
  const alive = useRef(true);

  const load = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    if (alive.current) setBusy(true);
    try {
      const response = await fetch("/api/caixas", {
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error();
      const data: Board = await response.json();
      if (alive.current) {
        setBoard(data);
        setError("");
      }
    } catch {
      if (alive.current)
        setError(
          "Não foi possível consultar os caixas. Os dados abaixo podem estar desatualizados.",
        );
    } finally {
      inFlight.current = false;
      if (alive.current) setBusy(false);
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    void load();
    const timer = setInterval(() => void load(), 5000);
    return () => {
      alive.current = false;
      clearInterval(timer);
    };
  }, [load]);

  useEffect(() => {
    let active = true;
    void QRCode.toDataURL(window.location.origin, { width: 176, margin: 1 })
      .then((data) => {
        if (active) setQr(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  function choose(id: number) {
    setSelected(id);
    const checkout = board?.checkouts.find((c) => c.id === id);
    if (checkout) {
      setPeople(String(checkout.people));
      setProducts(String(checkout.products));
      setOpen(checkout.open);
    }
    setNotice("");
  }

  async function save() {
    setSaving(true);
    setNotice("");
    setSaveFailed(false);
    try {
      const response = await fetch(`/api/caixas/${selected}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          people: Number(people),
          products: Number(products),
          open,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) {
        const problem = await response.json().catch(() => ({}));
        throw new Error(
          response.status === 404
            ? "A edição deste caixa não está disponível."
            : problem.detail || "Não foi possível salvar. Tente novamente.",
        );
      }
      setNotice(
        `Caixa ${number(board?.checkouts.find((c) => c.id === selected)?.number ?? selected)} atualizado.`,
      );
      await load();
    } catch (e) {
      setSaveFailed(true);
      setNotice(e instanceof Error ? e.message : "Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const best = board?.checkouts.find((c) => c.id === board.recommendedId);
  const openCount = board?.checkouts.filter((c) => c.open).length ?? 0;
  const waitCategories = classifyQueueWaits(board?.checkouts ?? []);
  const maxWait = Math.max(
    1,
    ...(board?.checkouts.filter((c) => c.open).map((c) => c.waitSeconds ?? 0) ??
      []),
  );

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Ir para o conteúdo
      </a>
      <header className="site-header">
        <div className="page-width header-inner">
          <a href="/" className="brand" aria-label="Fila Clara, início">
            <span className="brand-symbol" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            Fila Certa
          </a>
        </div>
      </header>

      <main id="main" className="page-width main-content">
        <div className="page-heading">
          <div>
            <h1>Escolha o caixa</h1>
            <p className="page-description">Veja onde a espera é menor.</p>
          </div>
          <button
            className="button button-secondary"
            onClick={() => void load()}
            disabled={busy}
          >
            <RefreshCw size={16} strokeWidth={1.7} aria-hidden="true" />
            {busy ? "Atualizando…" : "Atualizar"}
          </button>
        </div>

        <nav className="view-nav" aria-label="Visualização">
          <button
            aria-current={mode === "customer" ? "page" : undefined}
            onClick={() => setMode("customer")}
          >
            Filas
          </button>
          <button
            aria-current={mode === "simulation" ? "page" : undefined}
            onClick={() => {
              setMode("simulation");
              choose(selected);
            }}
          >
            Simular
          </button>
        </nav>

        {error && (
          <div role="alert" className="error-message">
            {board
              ? "Não foi possível atualizar. Exibindo os últimos dados."
              : "Não foi possível carregar as filas. Tente novamente."}
          </div>
        )}

        <div
          className={`workspace ${mode === "simulation" ? "with-editor" : ""}`}
        >
          <div className="queue-content">
            <section
              className={`recommendation ${!best ? "recommendation-empty" : ""}`}
              aria-label="Caixa recomendado"
            >
              {best ? (
                <>
                  <div className="checkout-sign" aria-hidden="true">
                    {number(best.number)}
                  </div>
                  <div className="recommendation-copy">
                    <p className="recommendation-label">Menor espera</p>
                    <h2>Caixa {number(best.number)}</h2>
                    <p>
                      {quantity(best.people, "pessoa", "pessoas")} ·{" "}
                      {quantity(best.products, "produto", "produtos")}
                    </p>
                  </div>
                  <div className="recommendation-time">
                    <strong>
                      {best.waitSeconds !== null
                        ? duration(best.waitSeconds)
                        : "—"}
                    </strong>
                    <span>Espera Estimada</span>
                  </div>
                </>
              ) : (
                <div className="empty-copy">
                  <h2>
                    {error
                      ? "Recomendação indisponível"
                      : !board
                        ? "Consultando os caixas…"
                        : "Nenhum caixa aberto"}
                  </h2>
                  <p>
                    {error
                      ? "Atualize a consulta para conferir a menor espera."
                      : !board
                        ? "Aguarde enquanto buscamos as informações."
                        : "A lista será atualizada quando houver atendimento."}
                  </p>
                </div>
              )}
            </section>

            <div className="section-heading">
              <h2>Comparar filas</h2>
              <span>
                {board
                  ? `${openCount} de ${board.checkouts.length} caixas abertos`
                  : "Aguardando consulta"}
              </span>
            </div>
            <div
              className="wait-legend"
              aria-label="Classificação relativa das filas"
            >
              <span>
                <i className="legend-short" aria-hidden="true" />
                Menor espera
              </span>
              <span>
                <i className="legend-medium" aria-hidden="true" />
                Espera intermediária
              </span>
              <span>
                <i className="legend-long" aria-hidden="true" />
                Maior espera
              </span>
            </div>
            <div className="queue-table-wrap">
              <table className="queue-table">
                <caption className="sr-only">
                  Caixas, situação, pessoas, produtos e espera estimada
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Caixa</th>
                    <th scope="col" className="status-column">
                      Situação
                    </th>
                    <th scope="col" className="quantity-column">
                      Pessoas
                    </th>
                    <th scope="col" className="quantity-column">
                      Produtos
                    </th>
                    <th scope="col" className="wait-column">
                      Espera estimada
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {board?.checkouts.map((c) => {
                    const category = waitCategories.get(c.id);
                    return (
                      <tr
                        key={c.id}
                        className={`${best?.id === c.id ? "recommended-row" : ""} ${!c.open ? "closed-row" : ""} ${category ? `wait-${category}` : ""}`}
                      >
                        <th scope="row">
                          <div className="row-identity">
                            <span className="row-number">
                              {number(c.number)}
                            </span>
                            <span className="row-label">
                              Caixa {number(c.number)}
                              <span className="row-note">
                                {!c.open
                                  ? "Fechado"
                                  : category
                                    ? waitLabels[category]
                                    : "Espera indisponível"}
                              </span>
                            </span>
                          </div>
                          <span className="mobile-count">
                            {c.open
                              ? `${quantity(c.people, "pessoa", "pessoas")} · ${quantity(c.products, "produto", "produtos")}`
                              : "Sem atendimento"}
                          </span>
                        </th>
                        <td className="status-column">
                          <span
                            className={`status ${c.open ? "status-open" : ""}`}
                          >
                            <span aria-hidden="true" />
                            {c.open ? "Aberto" : "Fechado"}
                          </span>
                        </td>
                        <td className="quantity-column tabular-nums">
                          {c.open ? c.people : "—"}
                        </td>
                        <td className="quantity-column tabular-nums">
                          {c.open ? c.products : "—"}
                        </td>
                        <td className="wait-cell">
                          <strong>
                            {c.open && c.waitSeconds !== null
                              ? duration(c.waitSeconds)
                              : "—"}
                          </strong>
                          {c.open && c.waitSeconds !== null && (
                            <div className="wait-track" aria-hidden="true">
                              <span
                                style={{
                                  width: `${Math.max(2, (c.waitSeconds / maxWait) * 100)}%`,
                                }}
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!board && (
                <p className="table-placeholder">
                  {error ? "Nenhum dado disponível." : "Carregando filas…"}
                </p>
              )}
              {board?.checkouts.length === 0 && (
                <p className="table-placeholder">Não há caixas cadastrados.</p>
              )}
            </div>
            <div className="table-footer">
              <span
                className={`connection ${error ? "connection-offline" : ""}`}
              >
                <span aria-hidden="true" />
                {error ? "Tentando reconectar" : "Atualização automática"}
              </span>
              <span>
                {board ? `Atualizado às ${time(board.fetchedAt)}` : "—"}
              </span>
            </div>
          </div>

          {mode === "simulation" && (
            <aside className="editor" aria-labelledby="editor-title">
              <h2 id="editor-title">Simular fila</h2>
              <p className="editor-description">
                Altere os dados e veja a recomendação mudar.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void save();
                }}
              >
                <fieldset
                  disabled={saving || !board || board.checkouts.length === 0}
                >
                  <label>
                    Caixa
                    <select
                      aria-label="Caixa"
                      value={selected}
                      onChange={(e) => choose(Number(e.target.value))}
                    >
                      {board?.checkouts.map((c) => (
                        <option key={c.id} value={c.id}>
                          Caixa {number(c.number)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="field-pair">
                    <label>
                      Pessoas
                      <input
                        required
                        type="number"
                        min="0"
                        max="1000"
                        step="1"
                        value={people}
                        onChange={(e) => setPeople(e.target.value)}
                      />
                    </label>
                    <label>
                      Produtos
                      <input
                        required
                        type="number"
                        min="0"
                        max="100000"
                        step="1"
                        value={products}
                        onChange={(e) => setProducts(e.target.value)}
                      />
                    </label>
                  </div>
                  <label>
                    Situação
                    <select
                      aria-label="Situação"
                      value={String(open)}
                      onChange={(e) => setOpen(e.target.value === "true")}
                    >
                      <option value="true">Aberto</option>
                      <option value="false">Fechado</option>
                    </select>
                  </label>
                  <button className="button button-primary" type="submit">
                    {saving ? "Salvando…" : "Aplicar alteração"}
                  </button>
                </fieldset>
              </form>
              {notice && (
                <p
                  role={saveFailed ? "alert" : "status"}
                  className={`form-notice ${saveFailed ? "form-error" : ""}`}
                >
                  {notice}
                </p>
              )}
            </aside>
          )}
        </div>

        <div className="support-row">
          <details className="explanation">
            <summary>Como a espera é estimada?</summary>
            <p>
              Consideramos 10 segundos por produto e 30 segundos por pessoa para
              pagamento. Uma fila com mais pessoas pode ser mais rápida se
              houver menos produtos.
            </p>
            <p>
              Estes parâmetros são demonstrativos e ainda não foram validados em
              um supermercado.
            </p>
          </details>
        </div>
        <footer className="page-footer">
          <span>Fila Certa</span>
          <span>Dados simulados · estimativas aproximadas</span>
        </footer>
      </main>
    </div>
  );
}
