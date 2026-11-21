import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyQueueWaits } from "../src/queueWait.ts";

const queue = (id, waitSeconds, open = true) => ({ id, waitSeconds, open });

test("classifica os tempos em relação aos caixas abertos", () => {
  const result = classifyQueueWaits([
    queue(1, 60), queue(2, 120), queue(3, 300), queue(4, 600, false),
  ]);
  assert.deepEqual([...result], [[1, "short"], [2, "medium"], [3, "long"]]);
});

test("tempos iguais recebem a mesma classificação", () => {
  const result = classifyQueueWaits([
    queue(1, 0), queue(2, 0), queue(3, 30), queue(4, 30),
  ]);
  assert.deepEqual([...result], [[1, "short"], [2, "short"], [3, "long"], [4, "long"]]);
  assert.deepEqual([...classifyQueueWaits([queue(1, 30), queue(2, 30)])], [[1, "short"], [2, "short"]]);
});

test("ignora caixas fechados e sem estimativa", () => {
  assert.deepEqual([...classifyQueueWaits([queue(1, null), queue(2, 0, false)])], []);
  assert.deepEqual([...classifyQueueWaits([queue(1, 45), queue(2, null)])], [[1, "short"]]);
});

test("recalcula as classificações quando os tempos mudam", () => {
  assert.equal(classifyQueueWaits([queue(1, 10), queue(2, 20)]).get(1), "short");
  assert.equal(classifyQueueWaits([queue(1, 30), queue(2, 20)]).get(1), "long");
});
