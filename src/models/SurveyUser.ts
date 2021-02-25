import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('surveys_users')
export class SurveyUser {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  readonly user_id: string;

  @Column()
  readonly survey_id: string;

  @Column()
  value: number;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
