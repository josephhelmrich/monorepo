import { ApiClient } from './api-client';
import { ApiSettings } from './api-settings';
import { NgModule,ModuleWithProviders, SkipSelf, Optional  } from '@angular/core';


@NgModule({})
export class ApiClientModule {
	constructor(@Optional() @SkipSelf() parentModule: ApiClientModule) {
		if (parentModule) {
			throw new Error(
				'ApiClientModule is already loaded. Import it in the AppModule only');
		};
	}

  static forRoot(apiUrl: string): ModuleWithProviders<ApiClientModule> {
    return {
      ngModule: ApiClientModule,
      providers: [
        {provide: ApiSettings, useValue: { apiUrl: apiUrl }},
        ApiClient
       ]
    }
  }
}

// @Injectable({
//   providedIn: 'root',
// })
// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
// export class ApiClientModule { }
