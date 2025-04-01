export class RecordNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RecordNotFoundException';
  }
}