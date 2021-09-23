import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtInterceptor } from './jwt-interceptor';

/** Http interceptor providers in outside-in order */
export const InterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
];