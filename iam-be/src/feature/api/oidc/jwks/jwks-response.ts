import { ApiProperty } from '@nestjs/swagger';

export class JwksItem {
  @ApiProperty({ example: 'your-key-id', description: 'Key ID' })
  kid: string;

  @ApiProperty({ example: 'RSA', description: 'Key Type' })
  kty: string;

  @ApiProperty({ example: 'RS256', description: 'Algorithm' })
  alg: string;

  @ApiProperty({ example: 'sig', description: 'Use case, e.g., signature' })
  use: string;

  @ApiProperty({
    example: 'm-g-4YnMFDbh-rN8SzOOBablAAqEiZO3bOr6hrKfZ2aefGz3QylRp9arKCIZ...',
    description: 'Modulus part of the key',
  })
  n: string;

  @ApiProperty({ example: 'AQAB', description: 'Exponent part of the key' })
  e: string;
}

export class JwksResponse {
  @ApiProperty({
    type: [JwksItem],
    description: 'Array of JSON Web Keys',
  })
  keys: JwksItem[];
}
