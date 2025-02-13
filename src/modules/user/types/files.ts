import { multerFile } from "src/common/utils/multer.util"

export type ProfileImages = {
    image_profile: multerFile[];
    image_bg: multerFile[];
}