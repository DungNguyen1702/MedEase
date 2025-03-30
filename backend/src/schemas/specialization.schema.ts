import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SpecializationDocument = HydratedDocument<Specialization>;

@Schema()
export class Specialization {
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop()
  description: string;
}

export const SpecializationSchema =
  SchemaFactory.createForClass(Specialization);
