import { DateId } from "../../model/entities/time-slot";

export abstract class DateManager {
    abstract getCurrentDateId(): DateId;
  }
  