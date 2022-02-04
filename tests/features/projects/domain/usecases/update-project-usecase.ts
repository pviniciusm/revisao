import { NotFoundError } from "../../../../../src/core/domain/errors/not-found-error";
import { DatabaseConnection } from "../../../../../src/core/infra/database/connections/connection";
import { RedisConnection } from "../../../../../src/core/infra/database/connections/redis";
import { User } from "../../../../../src/core/infra/database/entities/User";
import { CacheRepository } from "../../../../../src/core/infra/repositories/cache-repository";
import { CreateProjectUseCase } from "../../../../../src/features/projects/domain/usecases/create-project-usecase";
import { ProjectRepository } from "../../../../../src/features/projects/infra/repositories/project-repository";
import { IUser } from "../../../../../src/features/user/domain/model/user";
import { UserRepository } from "../../../../../src/features/user/infra/repositories/user-repository";

class UpdateProjectUseCase {
    constructor(private userRepository: UserRepository) {}

    async run(params: { username: string; description: string }) {
        if (!(await this.userRepository.find(params.username))) {
            throw new NotFoundError("user");
        }

        if (params.description.length < 5) {
            throw new Error();
        }
    }
}

describe("update project usecase tests", () => {
    jest.mock(
        "../../../../../src/features/user/infra/repositories/user-repository"
    );

    const makeSut = () => {
        const userRepo = new UserRepository();
        const sut = new UpdateProjectUseCase(userRepo);
        return sut;
    };

    beforeAll(async () => {
        await DatabaseConnection.initConnection();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll((done) => {
        DatabaseConnection.getConnection()
            .close()
            .then(() => {
                done();
            });
    });

    test("should throw NotFoundError if user does not exist", async () => {
        jest.spyOn(UserRepository.prototype, "find").mockResolvedValue(
            undefined
        );

        expect.assertions(1);

        try {
            const result = await makeSut().run({
                username: "inexistent_user_asdasdas",
                description: "abc",
            });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("should return Error if description lenght is less than 5 characters", async () => {
        jest.spyOn(UserRepository.prototype, "find").mockResolvedValue(
            new User()
        );

        // expect.assertions(1);

        const result = makeSut().run({
            username: "any_user",
            description: "abc",
        });

        expect(result).rejects.toThrow(Error);
    });
});
