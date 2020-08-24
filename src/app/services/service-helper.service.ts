import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ServiceHelpersService {
    constructor(private http: HttpClient) { }


    public get<T>(url: string, params: HttpParams = new HttpParams(), withCredentials: boolean = false): Observable<T> {
        return this.http.get<T>(url, { params, withCredentials })
            .pipe(
                map(this.extractData),
                catchError(this.handleError.bind(this))
            );
    }

    public post<T>(url: string, data: object, addToken: boolean = false): Observable<T> {
        return this.http.post<T>(url, data, { withCredentials: addToken })
            .pipe(
                map(this.extractData),
                catchError(this.handleError.bind(this))
            );
    }

    private extractData<T>(res: T) {
        const body = res;
        return body || {};
    }

    private handleError(error: { status: number }) {
        if (error.status === 401) {
            throw error;
        } else {
            throw error;
        }
    }
}