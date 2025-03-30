import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SpecializationPriceDocument = HydratedDocument<SpecializationPrice>;

@Schema()
export class SpecializationPrice {
  @Prop({ required: true })
  specialization_id: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  description: string;
}

export const SpecializationPriceSchema =
  SchemaFactory.createForClass(SpecializationPrice);
