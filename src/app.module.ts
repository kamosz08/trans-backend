import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@orders-cluster.rpdlf.mongodb.net/orders?retryWrites=true&w=majority',
    ),
    OrdersModule,
    UsersModule,
  ],
})
export class AppModule {}
