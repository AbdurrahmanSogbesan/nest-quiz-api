import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Participant, ParticipantSchema } from './schema/participant.model';

const ParticipantFeature = MongooseModule.forFeature([
  { name: Participant.name, schema: ParticipantSchema },
]);

@Module({
  imports: [ParticipantFeature],
  exports: [ParticipantFeature],
})
export class ParticipantModule {}
