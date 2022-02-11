import request from "supertest";
import { DatabaseConnection } from "../../../../../src/core/infra/database/connections/connection";
import { RedisConnection } from "../../../../../src/core/infra/database/connections/redis";
import { createServer } from "../../../../../src/core/presentation/server";
import { makeUsers } from "../../../../helpers/make-users";
import { ProjectRepository } from "../../../../../src/features/projects/infra/repositories/project-repository";
import { IProject } from "../../../../../src/features/projects/domain/model/project";
import { Project } from "../../../../../src/core/infra/database/entities/Projects";

const makeProject = async () => {
    const { user } = await makeUsers();

    // export interface IProject {
    //     uid?: string;
    //     name: string;
    //     description: string;
    //     startDate?: Date;
    //     endDate?: Date;
    //     user: IUser;
    // }

    const projectCreate = {
        description: "any_description",
        user,
        name: "any_name",
    };

    const project = await new ProjectRepository().create(projectCreate);

    return { user, project };
};

describe("find project controller tests", () => {
    let app: Express.Application;

    beforeAll(async () => {
        await DatabaseConnection.initConnection();
        RedisConnection.initConnection();

        app = createServer();
    });

    afterAll(async () => {
        await DatabaseConnection.closeConnection();
        RedisConnection.closeConnection();
    });

    test("deveria retornar badRequest (400) se nao encontrar id", async () => {
        await request(app)
            .get(`/project/find`)
            .query({})
            .expect(400)
            .expect((response) => {
                expect(response.body).not.toBeFalsy();
                const correctBody = { ok: false, reason: "ID não informado" };
                expect(response.body).toMatchObject(correctBody);
            });
    });

    test("deveria retornar ok", async () => {
        const { project, user } = await makeProject();

        //project.user = undefined;
        await request(app)
            .get("/project/find")
            .query({ id: project.uid })
            .expect((response) => {
                expect(response.status).toEqual(200);
                expect(response.body.ok).toEqual(true);
                expect({
                    ...response.body.data,
                    created_at: JSON.parse(response.body.data.created_at),
                    user: undefined,
                }).toMatchObject({
                    ...project,
                    user: undefined,
                });
                expect(response.body.data).toMatchObject(response.body.data);

                console.log("project----------", project);
                console.log("response.body----------", response.body);
            });
    });
});
