import { DataSource } from "typeorm"
export const myDataSource = new DataSource({
    type: "postgres",
    url: process.env.POSTGRES_URL,
    entities: [__dirname + '/**/*.entity.{js,ts}'],
    logging: false,
    synchronize: true,
})