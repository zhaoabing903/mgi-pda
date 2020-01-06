import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class GlobalHttpIntercept implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let globalReq = req;

    globalReq = globalReq.clone({
      setHeaders: { 'Content-Type': 'application/json' }
    });
    if (
      !req.url.includes('assets/i18n') &&
      !req.url.includes('api/account/login')
    ) {
      const token = window.localStorage.getItem('TOKEN');
      if (token !== null && token !== undefined) {
        globalReq = globalReq.clone({
          setHeaders: { Authorization: window.localStorage.getItem('TOKEN') }
        });
      }
    }
    return next.handle(globalReq).pipe(
      // 查看响应数据
      tap((event: any) => {
        if (event instanceof HttpResponse && event.status === 200) {
          // this.logService.print(`全局HTTP拦截器响应请求${globalReq.url}--状态:${event.statusText},信息:${event.body}`);
          return this.handleData(event);
        }
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err))
    );
    // return next.handle(globalReq);
  }

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse
  ): Observable<any> {
    // 业务处理：一些通用操作
    let errMsg: string;
    switch (event.status) {
      case 200:
        break;
      case 400: // Bad Request
        if (event['error'].error) {
          errMsg = event['error'].error;
        }
        break;
      case 401: // 未登录状态码
        errMsg = '登录超时，请重新登录';
        this.goTo('/login');
        break;
      case 403:
        errMsg = '403 ERROR.';
        break;
      case 404:
        errMsg = '不存在的访问请求';
        break;
      case 500:
        if (event['error'].msg) {
          errMsg = event['error'].msg;
        }
        errMsg = '未知错误';
        break;
      default:
        if (event instanceof HttpErrorResponse) {
          errMsg = '未可知错误，大部分是由于后端不支持CORS或无效配置引起';
        }
        break;
    }

    if (event instanceof HttpErrorResponse) {
      return throwError(errMsg);
    } else {
      return of(event);
    }

    // if(errMsg){
    //   return Observable.throw(errMsg);
    //   //this.alertMsg(errMsg);
    // }
    // return of(event);
  }

  private goTo(url: string) {
    // 退出到登录页面
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }
}
