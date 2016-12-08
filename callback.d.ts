/**
 * Created by zsiri on 2016.10.29..
 */

type Callback<T> = (err: NodeJS.ErrnoException, data?: T) => void;
type Callback2<T1, T2> = (err: NodeJS.ErrnoException, data1?: T1, data2?: T2) => void;
type Callback3<T1, T2, T3> = (err: NodeJS.ErrnoException, data1?: T1, data2?: T2, data3?: T3) => void;
