import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmDbConfig implements TypeOrmOptionsFactory {
    createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        const {DB, DBHOST, DBUSERNAME, DBPORT, DBPASSWORD} = process.env;
        return {
            type: "postgres",
            database: DB,
            port: parseInt(DBPORT || '5432', 10),
            host: DBHOST,
            username: DBUSERNAME,
            password: DBPASSWORD,
            synchronize: true,
            entities: [
                "dist/**/**/**/*.entity{.ts,.js}",
                "dist/**/**/*.entity{.ts,.js}",
            ]
        }
    }
}