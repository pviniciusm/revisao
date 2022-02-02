import { NotFoundError } from "../../../../../src/core/domain/errors/not-found-error";
import { DatabaseConnection } from "../../../../../src/core/infra/database/connections/connection";
import { RedisConnection } from "../../../../../src/core/infra/database/connections/redis";
import { CacheRepository } from "../../../../../src/core/infra/repositories/cache-repository";
import { CreateProjectUseCase } from "../../../../../src/features/projects/domain/usecases/create-project-usecase";
import { ProjectRepository } from "../../../../../src/features/projects/infra/repositories/project-repository";
import { UserRepository } from "../../../../../src/features/user/infra/repositories/user-repository";

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

    test("should throw NotFoundError if user does not exist", () => {
        const sut = makeSut();
        const result = sut.run({
            username: "inexistent_user_asdasdas",
            description: "any_description",
            name: "any_name",
        });

        expect(result).rejects.toThrow(NotFoundError);
    });
});
