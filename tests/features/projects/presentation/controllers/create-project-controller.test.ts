import request from "supertest";
import { DatabaseConnection } from "../../../../../src/core/infra/database/connections/connection";
import { RedisConnection } from "../../../../../src/core/infra/database/connections/redis";
import { createServer } from "../../../../../src/core/presentation/server";
import { ProjectRepository } from "../../../../../src/features/projects/infra/repositories/project-repository";
import { UserRepository } from "../../../../../src/features/user/infra/repositories/user-repository";
import { makeUsers } from "../../../../helpers/make-users";

describe.skip("Create project controller tests", () => {
    let app: Express.Application | undefined = undefined;

    beforeAll(async () => {
        await DatabaseConnection.initConnection();
        RedisConnection.initConnection();
    });

    afterAll(async () => {
        await DatabaseConnection.closeConnection();
        await RedisConnection.closeConnection();
    });

    test("deveria retornar badRequest (400) se o username não for informado", async () => {
        await request(app)
            .post("/project")
            .send({
                description: "teste",
            })
            .expect(400)
            .expect((response) => {
                expect(response.body).not.toBeFalsy();
                expect(response.body.ok).toBeFalsy();
                expect(response.body.error).toEqual("username not provided.");
            });
    });

    test("deveria retornar badRequest (500) se o description não for informado", async () => {
        const { user } = await makeUsers();

        await request(app)
            .post("/project")
            .send({
                username: user.username,
            })
            .expect(500)
            .expect((response) => {
                expect(response.body).not.toBeFalsy();
                expect(response.body.ok).toBeFalsy();
            });
    });

    test("deveria retornar 200 se o projeto for criado com sucesso", async () => {
        const { user } = await makeUsers();

        await request(app)
            .post("/project")
            .send({
                description: "any_description",
                username: user.username,
                name: "any_name",
            })
            .expect((response) => {
                expect(response.status).toEqual(200);
                expect(response.body).not.toBeFalsy();
                expect(response.body.ok).not.toBeFalsy();
                expect(response.body.error).toBeFalsy();
                expect(response.body.data).toEqual(
                    "Project was successfully created"
                );
            });
    });
});
