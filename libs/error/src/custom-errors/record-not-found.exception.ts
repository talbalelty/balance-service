import { HttpException, HttpStatus } from "@nestjs/common";

export class RecordNotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
    this.name = 'RecordNotFoundException';
  }
}