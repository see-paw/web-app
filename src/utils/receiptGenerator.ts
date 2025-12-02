/**
 * Mock receipt for ownership requests
 */
export interface Receipt {
    id: string;
    receiptNumber: string;
    month: string; // "Janeiro 2025"
    date: string; // ISO date string
    amount: number;
    animalName: string;
    ownerName: string;
    paymentMethod: string; // "Cartão ****1234"
    iban: string; // "PT50 0000 0000 1234567890"
}

/**
 * Generates mock receipts for an approved ownership request.
 * 
 * Creates one receipt per month from approval date until current date,
 * always on the same day of month as approval.
 * 
 * @param approvedAt - ISO date string when request was approved
 * @param amount - Monthly amount in euros
 * @param animalName - Name of the adopted animal
 * @param ownerName - Name of the owner
 * @returns Array of mock receipts
 * 
 * @example
 * // Approved on 2024-12-02, today is 2025-01-15
 * generateMockReceipts("2024-12-02T10:00:00", 30, "Bolinhas", "Carlos Santos")
 * // Returns: [
 * //   { month: "Dezembro 2024", date: "2024-12-02", ... },
 * //   { month: "Janeiro 2025", date: "2025-01-02", ... }
 * // ]
 */
export function generateMockReceipts(
    approvedAt: string,
    amount: number,
    animalName: string,
    ownerName: string
): Receipt[] {
    const receipts: Receipt[] = [];
    const approvalDate = new Date(approvedAt);
    const today = new Date();
    
    // Get day of month from approval date
    const dayOfMonth = approvalDate.getDate();
    
    // Start from approval month/year
    let currentDate = new Date(approvalDate);
    currentDate.setDate(dayOfMonth);
    currentDate.setHours(0, 0, 0, 0);
    
    let receiptCounter = 1;
    
    // Generate receipts for each month until today
    while (currentDate <= today) {
        const year = currentDate.getFullYear();
        const monthIndex = currentDate.getMonth();
        
        // Portuguese month names
        const monthNames = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        
        const receipt: Receipt = {
            id: `receipt-${year}-${String(monthIndex + 1).padStart(2, '0')}`,
            receiptNumber: `REC-${year}-${String(receiptCounter).padStart(3, '0')}`,
            month: `${monthNames[monthIndex]} ${year}`,
            date: currentDate.toISOString(),
            amount: amount,
            animalName: animalName,
            ownerName: ownerName,
            paymentMethod: generateMockPaymentMethod(),
            iban: generateMockIBAN()
        };
        
        receipts.push(receipt);
        receiptCounter++;
        
        // Move to next month, same day
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Return in reverse order (newest first)
    return receipts.reverse();
}

/**
 * Generates a mock credit card number (last 4 digits)
 */
function generateMockPaymentMethod(): string {
    const lastFourDigits = Math.floor(1000 + Math.random() * 9000);
    return `Cartão ****${lastFourDigits}`;
}

/**
 * Generates a mock Portuguese IBAN
 */
function generateMockIBAN(): string {
    const randomDigits = Array.from({ length: 18 }, () => 
        Math.floor(Math.random() * 10)
    ).join('');
    
    return `PT50 ${randomDigits.slice(0, 4)} ${randomDigits.slice(4, 8)} ${randomDigits.slice(8, 12)} ${randomDigits.slice(12, 16)} ${randomDigits.slice(16)}`;
}

/**
 * Formats a date to Portuguese locale (DD/MM/YYYY)
 */
export function formatReceiptDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}