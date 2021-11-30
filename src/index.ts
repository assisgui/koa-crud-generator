import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import * as Koa from "koa";
import { generateRouter } from "./lib";

createConnection().then(async connection => {
    const app = new Koa();

    // TODO: add option param to override handlers if necessary
    // TODO: changed first param to accept json with enable/disable API methods, filters to getAll, joi validation and further handlers (like auth)
    // TODO: SUPER PLUS: add swagger documentation or insomnia integration
    app.use(generateRouter([ User ]))
    app.listen(3000);

    //region first insert
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);
    //endregion

}).catch(error => console.log(error));
