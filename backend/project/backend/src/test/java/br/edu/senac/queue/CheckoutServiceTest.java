package br.edu.senac.queue;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.*;
import org.springframework.web.server.ResponseStatusException;
class CheckoutServiceTest {
 Checkout item(long id,int number,boolean open,int people,int products){
  Checkout c=mock(Checkout.class);when(c.getId()).thenReturn(id);when(c.getNumber()).thenReturn(number);when(c.isOpen()).thenReturn(open);when(c.getPeople()).thenReturn(people);when(c.getProducts()).thenReturn(products);return c;
 }
 @Test void estimatesProductVolume(){assertEquals(460,WaitEstimator.seconds(2,40));assertEquals(240,WaitEstimator.seconds(3,15));assertEquals(0,WaitEstimator.seconds(0,0));assertThrows(IllegalArgumentException.class,()->WaitEstimator.seconds(-1,0));}
 @Test void choosesFastestNotShortestQueue(){var r=mock(CheckoutRepository.class);when(r.findAllByOrderByNumberAsc()).thenReturn(List.of(item(1,1,true,2,40),item(2,2,true,3,15),item(3,3,true,1,30),item(4,4,false,0,0)));assertEquals(2L,new CheckoutService(r).board().recommendedId());}
 @Test void breaksTiesByNumber(){var r=mock(CheckoutRepository.class);when(r.findAllByOrderByNumberAsc()).thenReturn(List.of(item(2,2,true,1,3),item(1,1,true,1,3)));assertEquals(1L,new CheckoutService(r).board().recommendedId());}
 @Test void closedAndEmptyBoardsHaveNoRecommendation(){var r=mock(CheckoutRepository.class);when(r.findAllByOrderByNumberAsc()).thenReturn(List.of(item(1,1,false,0,0)));assertNull(new CheckoutService(r).board().recommendedId());when(r.findAllByOrderByNumberAsc()).thenReturn(List.of());assertNull(new CheckoutService(r).board().recommendedId());}
 @Test void rejectsMissingAndInconsistentUpdates(){var r=mock(CheckoutRepository.class);var s=new CheckoutService(r);assertThrows(ResponseStatusException.class,()->s.update(1,new CheckoutUpdate(null,null,null)));when(r.findById(1L)).thenReturn(Optional.of(item(1,1,true,2,40)));assertThrows(ResponseStatusException.class,()->s.update(1,new CheckoutUpdate(null,0,40)));assertThrows(ResponseStatusException.class,()->s.update(99,new CheckoutUpdate(true,0,0)));}
}
