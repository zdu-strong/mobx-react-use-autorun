import { lastValueFrom, timer } from 'rxjs';

export async function timeout(due: number | Date) {
    await lastValueFrom(timer(due));
}