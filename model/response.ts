import { Msg } from '~model/message';

export interface Response<T = null> extends Msg {
  data: T;
}
