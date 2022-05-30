import './style.css';

import {
  of,
  map,
  Observable,
  forkJoin,
  delay,
  combineLatest,
  interval,
  throwError,
  zip,
  from,
  concat,
  merge,
  race,
  fromEvent,
} from 'rxjs';
import {
  endWith,
  pairwise,
  startWith,
  take,
  withLatestFrom,
} from 'rxjs/operators';

const observe = {
  next: (data) => console.log(data),
  error: (message) => console.error(message),
  complete: () => console.log('Complete!'),
};
// --------------------RxJS Combination Operator-------------------
// Kết hợp các Observable

// forkJoin(): Là 1 function, nhận vào các observable và trả về 1 observable, chạy song song các observable này, khi tất cả các observable complete thì emit các dữ liệu mà các observable emit rồi complete
/**
 * forkJoin(): Có thể nhận vào các observable theo các cách:
 * truyền dưới dạng các đối số: emit kết quả dưới dạng mảng
 * truyền dưới dạng mảng observable: emit kết quả dạng mảng
 * truyền dưới dạng object: emit kết quả dạng object với key tương ứng vs key của observable truyền vào
 * forkJoin() sẽ không emit nếu 1 trong các observable truyền vào không complete
 * forkJoin() sẽ throwError nếu 1 trong các observable truyền vào throwError
 */
forkJoin(
  of(1).pipe(delay(5000)),
  of('Obseevable 2').pipe(delay(1000)),
  of(['Observable 3']).pipe(delay(2000))
);
forkJoin({
  observable1: of(1).pipe(delay(4000)),
  observable2: of(2).pipe(delay(1000)),
  observable3: of(3).pipe(delay(2000)),
});

// combineLatest():
/**
 * Nhóm các observale, không cần observable truyền vào phải complete.
 * Nhận vào 1 mảng các observable và trả về 1 observale (Tạm gọi là Result Observable). Khi subscribe, các observable truyền vào emit ít nhất 1 lần thì Result Obsrevable sẽ emit, các lần tiếp theo, chỉ cần 1 trong các observable truyền vào emit thì Result Observable sẽ emit giá trị của observable đó cùng các giá trị cũ của các observable khác dưới dạng mảng.
 * Nếu 1 trong các obsrevable truyền vào throwError() thì Result Observable sẽ throwError
 * Result Observable chỉ compelte khi tất các các observable truyền vào đã complete
 */
let aa = combineLatest([throwError('error'), interval(1000)]);

// zip(): Là 1 function nhận vào danh sách các observable đưới dạng mảng hoặc các đối số, nó nhóm các emit của observale truyền vào thành các cặp. Khi obervable có số lần emit ít nhất complete thì observable mà zip() trả về sẽ complete. Các giá trị emit của observable không có cặp sẽ bị mất.
zip([of(1, 2, 3, 10), from([4, 5, 6]), interval(1000)]);

// concat(): Là 1 function, nhận vào các Observable
// Khi subcribe sẽ subscribe lần lượt vào các observable con, khi observable hiện tại emit xong và complete thì observable kế tiếp mới được thực thi. Khi tất cả observable được truyền vào emit hết dữ liệu và complete thì complete. Nếu observable hiện tại throwError thì sẽ throwError luôn. Nếu 1 trong các observable truyền vào k complete thì sẽ không thực thi observable tiếp theo.
concat(interval(1000).pipe(take(5)), of(10), of([1, 2, 4]));

// merge()
/**
 * Là 1 function nhận vào các observable, vầ trả về 1 observalbe, khi subcribe sẽ emit dữ liệu mà observable truyền vào emit, cứ thằng nào observable được tuyền vào nào emit thì merge() sex emit, không quan tâm đén thứ tự.
 * Ngoài ra, merge còn nhận vào 1 đối số cuối cùng là 1 number, quy định số observable được chạy song song.
 */
merge(
  interval(1000).pipe(
    map((val) => 'Observable 1: ' + val),
    take(3)
  ),
  interval(3000).pipe(
    map((val) => 'Observable 2: ' + val),
    take(3)
  ),
  interval(2000).pipe(
    map((val) => 'Observable 3: ' + val),
    take(3)
  ),
  interval(4000).pipe(
    map((val) => 'Observable 4: ' + val),
    take(3)
  ),
  2
);

// race(): Nhận vào đối số như các thằng trên
// khi subcribe, race() sẽ chạy tất các các observalbe được truyền vào, thằng nào emit trước thì race sẽ emit dữ liệu đó, bỏ qua các thằng còn lại và chạy lượt tiếp theo. Race sẽ complete khi có 1 thằng observable nào truyền vào nó complete
race(
  interval(1000).pipe(
    map((val) => 'Observable 1: ' + val),
    take(5)
  ),
  interval(1800).pipe(
    map((val) => 'Observable 2: ' + val),
    take(5)
  ),
  interval(2000).pipe(map((val) => 'Observable 3: ' + val))
);

// withLatestFrom(): Là 1 function (operator) sử dụng trong pipe()
// withLatestFrom(): Nhận vào 1 đối số là 1 observale, outer observable sẽ emit dữ liệu của nó cùng với giá trị mà observable truyền vào withLatestFrom() emit gần nhất đưới dạng mảng
fromEvent(document, 'click').pipe(withLatestFrom(interval(1000)));

// startWith(): Là 1 operator sử dụng trong pipe()
// startWith() Nhận vào 1 giá trị bất kỳ và emit nó trước khi outer observable emit
of('World!').pipe(startWith('Hello'));

// endWith(): giống như startWith nhưng emit sau cùng và trước outer observable complete.
// Không hoạt động với những observable không complete
interval(1000).pipe(take(8), endWith('End with emit'));

// pairwise(): Gộp giá trị mà outer observable emit với giá trị trước đó outer observable emit thành 1 mảng rồi emit.
interval(1000).pipe(pairwise());
