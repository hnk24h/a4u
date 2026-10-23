export type ArticleLanguage="vi"|"en"|"ja"|"ko"|"und";
export function detectLanguage(text:string):ArticleLanguage{const sample=text.slice(0,6000);if(/[\u3040-\u30ff]/u.test(sample))return"ja";if(/[\uac00-\ud7af]/u.test(sample))return"ko";if(/[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/u.test(sample))return"vi";if(/[A-Za-z]/u.test(sample))return"en";return"und"}
