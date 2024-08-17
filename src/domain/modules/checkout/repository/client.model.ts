import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import OrderModel from './order.model';

@Table({
  tableName: 'client',
  timestamps: false,
})
export default class ClientModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  address: string;

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: true })
  orderId: string;
}
