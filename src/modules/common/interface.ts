import { SuccessWrapper } from '../../util';
import { BaseUserDto } from './dto/user.dto';

export interface ImageCaptchaResult {
  img: string;
  id: number;
}

export class ListUser extends SuccessWrapper(BaseUserDto, true){}
export class ViewUser extends SuccessWrapper(BaseUserDto){}
export class ViewDone extends SuccessWrapper(null){}
