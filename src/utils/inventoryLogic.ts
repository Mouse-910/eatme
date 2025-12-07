export interface InventoryItem {
    id: string;
    name: string;
    imageURL: string;
    expirationDate: string; // ISO 8601 string
    quantity: number;
}

export type BucketType = 'Red' | 'Yellow' | 'Green';

export interface BucketSection {
    title: string;
    data: InventoryItem[];
    type: BucketType;
}

export const categorizeInventory = (items: InventoryItem[]): BucketSection[] => {
    const now = new Date();
    const sortedItems = [...items].sort((a, b) => {
        return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
    });

    const redBucket: InventoryItem[] = [];
    const yellowBucket: InventoryItem[] = [];
    const greenBucket: InventoryItem[] = [];

    const msInHour = 60 * 60 * 1000;
    const msInDay = 24 * msInHour;

    sortedItems.forEach((item) => {
        const expDate = new Date(item.expirationDate);
        const diffMs = expDate.getTime() - now.getTime();
        const diffHours = diffMs / msInHour;

        if (diffHours < 72) {
            redBucket.push(item);
        } else if (diffHours >= 72 && diffHours <= 7 * 24) {
            yellowBucket.push(item);
        } else {
            greenBucket.push(item);
        }
    });

    const sections: BucketSection[] = [];

    if (redBucket.length > 0) {
        sections.push({
            title: 'Urgent (Expires in < 72h)',
            data: redBucket,
            type: 'Red',
        });
    }

    if (yellowBucket.length > 0) {
        sections.push({
            title: 'Consume Soon (3-7 Days)',
            data: yellowBucket,
            type: 'Yellow',
        });
    }

    if (greenBucket.length > 0) {
        sections.push({
            title: 'Safe (> 7 Days)',
            data: greenBucket,
            type: 'Green',
        });
    }

    return sections;
};
