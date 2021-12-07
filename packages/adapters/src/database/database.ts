export interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

