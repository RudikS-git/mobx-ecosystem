import { isEqual } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { isObject } from 'utils';

type FieldOptionsType = { onError?: boolean };
type Nullable<T> = T | null;

export class FieldService<T> {
  validate?(): Promise<void>;
  _serviceType = 'field-service';
  _initValue?: Nullable<T> = undefined;
  _value?: Nullable<T> = undefined;
  _error?: string = undefined;
  _disabled = false;

  options?: FieldOptionsType;

  constructor(initValue?: T, options?: FieldOptionsType) {
    makeAutoObservable(this);

    this.initValue = initValue;
    this.options = options;
  }

  get initValue() {
    return this._initValue;
  }

  set initValue(initValue: Nullable<T> | undefined) {
    this._initValue = initValue;
    this._value = initValue;
    this.validate && this.validate();
  }

  get value() {
    return this._value;
  }

  set value(value: Nullable<T> | undefined) {
    this._value = value;
  }

  get error() {
    return this._error;
  }

  set error(error: string | undefined) {
    this._error = error;
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  get isValid() {
    return !this._error;
  }

  get isInit() {
    if (isObject(this.value)) {
      return isEqual(this.value, this._initValue);
    }

    return this._value === this._initValue;
  }

  onChange = (_: any, value: T) => {
    this.value = value;
    this.validate && this.validate();
  }

  // TODO: Rethink...
  get props() {
    let commonProps: any = {
      value: this.value,
      error: this.error,
      disabled: this.disabled,
    };

    if (this.options?.onError) {
      commonProps = {
        ...commonProps,
        onError: (err: any) => {
          this.error = this.error || err?.toString();
        },
      };
    }

    return {
      ...commonProps,
      onChange: this.onChange
    };
  }
}
