FROM node:20-alpine

WORKDIR /opt/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Strapi local upload sağlayıcısı bu klasörün var olmasını bekler.
# public/uploads gitignore'da olduğu için image'a girmez; burada oluşturuyoruz.
RUN mkdir -p public/uploads

RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "develop"]