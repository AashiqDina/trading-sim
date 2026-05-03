import axios from "axios";
import { ApiError } from "../error/ApiError";
import getAllUsers from "./getAllUsers";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getAllUsers", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockData = [
        {
            friendsUserId: 3,
            profitLoss: 385,
            userId: 1,
            username: "TestUser1",
        },
        {
            friendsUserId: 4,
            profitLoss: 157,
            userId: 1,
            username: "TestUser2",
        },
    ];

    test("returns data on success", async () => {

        mockedAxios.get.mockResolvedValue({
            data: mockData,
        });

        const result = await getAllUsers();

        expect(result).toEqual(mockData);
        expect(mockedAxios.get).toHaveBeenCalledWith("https://tradingsim-backend.onrender.com/api/User/List");
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    });

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(getAllUsers()).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.get.mockRejectedValue(123);

        await expect(getAllUsers()).rejects.toEqual(new ApiError(-1));
    });
});