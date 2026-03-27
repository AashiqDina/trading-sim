import { marketNews } from "../../types/types";

export const mockMarketNews: marketNews[] = Array.from({ length: 20 }, (_, i) => ({
    category: `Category ${i + 1}`,
    datetime: 1680000000 + i * 3600,
    headline: `Headline ${i + 1}`,
    id: i + 1,
    image: `image_${i + 1}`,
    related: `Related ${i + 1}`,
    source: `Source ${i + 1}`,
    summary: `This is the summary for news ${i + 1}.`,
    url: ``,
}));