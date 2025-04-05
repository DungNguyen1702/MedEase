import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
export type SpecializationDocument = HydratedDocument<Specialization>;

@Schema()
export class Specialization {
  @Prop({ required: true, unique: true, default: uuidv4 })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  base_price: number;
}

export const SpecializationSchema =
  SchemaFactory.createForClass(Specialization);
