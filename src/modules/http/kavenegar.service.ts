import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as process from 'node:process';
import * as querystring from 'node:querystring';
import { SmsTemplate } from './enums/sms-template.enum';

@Injectable()
export class KavenegarService {
  constructor(private httpService: HttpService) {}
  async SendVerificationSMS(receptor: string, code: string) {
    const params = querystring.stringify({
      receptor,
      code,
      template: SmsTemplate.Verify,
    });
    console.log(params);
    const { SEND_SMS_URL } = process.env;
    const result = await lastValueFrom(
      this.httpService
        .get(`${SEND_SMS_URL}?${params}`)
        .pipe(map((res) => res.data))
        .pipe(
          catchError((err) => {
            console.log(err);
            throw new InternalServerErrorException(
              "kavenegar's server is down",
            );
          }),
        ),
    );
    console.log(result);
    return result;
  }
}
