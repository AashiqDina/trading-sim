import axios from "axios";
import { ApiError } from "../error/ApiError";
import getCompanyInformation from "./getCompanyInformation";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getCompanyInformation", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockData = {
        symbol: "SYMB",
        name: "Test Stock",
        address: "address",
        address2: "address2",
        city: "city",
        state: "state",
        zip: "zip",
        country: "country",
        phone: "phone",
        website: "website",
        ceo: "ceo",
        employees: "employees",
        exchange: "exchange",
        micCode: "micCode",
        industry: "industry",
        sector: "sector",
        type: "type",
        description: "desc"
    }

    const mockResponse = {
        profile: {
            hasError: false,
            errorCode: null,
            data: mockData,
        },
    }
    test("returns data on success", async () => {

        mockedAxios.get.mockResolvedValue({
            data: mockResponse
        });

        const result = await getCompanyInformation({symbol: "SYMB"});

        expect(result).toEqual(mockData);
        expect(mockedAxios.get).toHaveBeenCalledWith(`https://tradingsim-backend.onrender.com/api/stocks/GetCompanyDetails/SYMB`);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    });

    test("throws ApiError when hasErr", async () => {

        mockedAxios.get.mockResolvedValue({
            data: {
                profile: {
                    hasError: true,
                    errorCode: 400,
                    data: mockData,
                },
            },
        });

        await expect(getCompanyInformation({symbol: "SYMB"})).rejects.toEqual(new ApiError(400));

    })

    test("throws ApiError from axios response error", async () => {

        (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

        mockedAxios.get.mockRejectedValue({
            response: { status: 500 },
        });

        await expect(getCompanyInformation({symbol: "SYMB"})).rejects.toEqual(new ApiError(500));
    });

    test("throws ApiError(-1) for unknown error", async () => {

        mockedAxios.get.mockRejectedValue(123);

        await expect(getCompanyInformation({symbol: "SYMB"})).rejects.toEqual(new ApiError(-1));
    });
});