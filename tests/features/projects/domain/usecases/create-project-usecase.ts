import {
    MissingPrimaryColumnError,
    MongoError,
    PrimaryColumnCannotBeNullableError,
    QueryFailedError,
} from "typeorm";
import { NotFoundError } from "../../../../../src/core/domain/errors/not-found-error";
import { DatabaseConnection } from "../../../../../src/core/infra/database/connections/connection";
import { RedisConnection } from "../../../../../src/core/infra/database/connections/redis";
import { CacheRepository } from "../../../../../src/core/infra/repositories/cache-repository";
import { CreateProjectUseCase } from "../../../../../src/features/projects/domain/usecases/create-project-usecase";
import { ProjectRepository } from "../../../../../src/features/projects/infra/repositories/project-repository";
import { UserRepository } from "../../../../../src/features/user/infra/repositories/user-repository";

jest.mock(
    "../../../../../src/features/user/infra/repositories/user-repository"
);

describe("create project usecase tests", () => {
    const makeSut = () => {
        const projectRepo = new ProjectRepository();
        const userRepo = new UserRepository();
        const cacheRepo = new CacheRepository();

        const sut = new CreateProjectUseCase(projectRepo, userRepo, cacheRepo);
        return sut;
    };

    beforeAll(async () => {
        await DatabaseConnection.initConnection();
        RedisConnection.initConnection();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll((done) => {
        Promise.all([DatabaseConnection.getConnection().close()]).then(() => {
            RedisConnection.getConnection().disconnect(), done();
        });
        // .close()
        // .then(() => {
        //     done();
        // });
    });

    test("should throw NotFoundError if user does not exist (with mock)", async () => {
        jest.spyOn(UserRepository.prototype, "find").mockResolvedValue(
            undefined
        );

        expect.assertions(1);

        const sut = makeSut();
        try {
            await sut.run({
                username: "abc",
                description: "any_description",
                name: "any_name",
            });
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
        }
    });

    test("should return created Project if create is successfull", async () => {
        const user = {
            username: "abc",
        };

        jest.spyOn(UserRepository.prototype, "find").mockResolvedValue({
            ...user,
            nome: "teste",
            cpf: "122",
        });

        expect.assertions(1);

        const sut = makeSut();
        try {
            await sut.run({
                username: "abc",
                description: "any_description",
                name: "any_name",
            });
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
        }
    });
});
