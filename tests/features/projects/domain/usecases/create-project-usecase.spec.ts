import { NotFoundError } from "../../../../../src/core/domain/errors/not-found-error";
import {
    DatabaseConnection,
    RedisConnection,
} from "../../../../../src/core/infra/database/connections";

import { CacheRepository } from "../../../../../src/core/infra/repositories/cache-repository";
import {
    CreateProjectUseCase,
    IUserRepository,
} from "../../../../../src/features/projects/domain/usecases/create-project-usecase";
import { ProjectRepository } from "../../../../../src/features/projects/infra/repositories/project-repository";
import { IUser } from "../../../../../src/features/user/domain/model/user";
import { UserRepository } from "../../../../../src/features/user/infra/repositories/user-repository";

describe("Create Project UseCase tests", () => {
    jest.mock(
        "../../../../../src/features/user/infra/repositories/user-repository"
    );

    const makeSut = () => {
        const userRepo = new UserRepository();
        const projectRepo = new ProjectRepository();
        const cacheRepo = new CacheRepository();

        const sut = new CreateProjectUseCase(projectRepo, userRepo, cacheRepo);
        return sut;
    };

    beforeAll(async () => {
        await DatabaseConnection.initConnection();
        RedisConnection.initConnection();
    });

    afterAll(async () => {
        await DatabaseConnection.closeConnection();
        await RedisConnection.closeConnection();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("deveria gerar NotFoundError se o usuario não existe", async () => {
        jest.spyOn(UserRepository.prototype, "find").mockResolvedValue(
            undefined
        );

        const sut = makeSut();

        expect.assertions(3);

        try {
            await sut.run({
                username: "teste",
                description: "any_description",
                name: "any_name",
            });
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);

            const err = error as NotFoundError;
            expect(err.name).toEqual("NotFoundError");
            expect(err.message).toEqual("user not found.");
        }
    });

    test("deveria retornar ok se o projeto for criado", async () => {
        const sut = makeSut();

        const user = {
            cpf: "123",
            nome: "teste",
            username: "teste",
        };

        jest.spyOn(UserRepository.prototype, "find").mockResolvedValue(user);

        const project = {
            username: user.username,
            description: "any_description",
            name: "any_name",
        };

        const result = await sut.run(project);

        expect(result).toBeTruthy();
        expect(result.description).toEqual(project.description);
        expect(result.name).toEqual(project.name);
        expect(result.endDate).toBeFalsy();

        expect(result.user).toBeTruthy();
        expect(result.user.username).toEqual(user.username);
    });
});
