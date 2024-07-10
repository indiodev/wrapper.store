// import { S3Disk } from '#utils/s3.disk'
import env from '#start/env'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { Disk } from 'flydrive'
import { S3Driver } from 'flydrive/drivers/s3'
import { randomUUID } from 'node:crypto'
import { createReadStream } from 'node:fs'

export const S3Disk = new Disk(
  new S3Driver({
    credentials: {
      accessKeyId: env.get('STORE_ACCESS_KEY_ID'),
      secretAccessKey: env.get('STORE_SECRET_ACCESS_KEY'),
    },
    region: env.get('STORE_DEFAULT_REGION'),
    bucket: env.get('STORE_BUCKET_NAME'),
    visibility: 'public',
  })
)

export class StoreUploadService {
  constructor(private storage = S3Disk) {}

  async upload(
    payload: { file: MultipartFile; identifier: string }[],
    pathname: string
  ): Promise<{ url: string; identifier: string }[]> {
    if (payload?.length === 0) return []

    const locations: { url: string; identifier: string }[] = []

    for (const { file, identifier } of payload) {
      const filename = `${pathname}/${randomUUID()}.${file.extname}`
      await this.storage.putStream(filename, createReadStream(file.tmpPath!))
      const url = await this.storage.getUrl(filename)
      locations.push({ url, identifier })
    }

    return locations
  }
}
