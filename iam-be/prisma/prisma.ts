import { PrismaClient } from '@prisma/client';
import { format } from 'sql-formatter';
import { TerminalStylingUtils } from './terminal-styling-utils';

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
    {
      emit: 'event',
      level: 'error',
    },
  ],
  transactionOptions: {
    timeout: 30000,
  },
});

prismaClient.$on('query', (event) => {
  if (
    event.query.includes('BEGIN') ||
    event.query.includes('COMMIT') ||
    event.query.includes('ROLLBACK') ||
    event.query.includes('SELECT 1')
  ) {
    return;
  }
  console.log(
    TerminalStylingUtils.setBlue('===================================='),
  );
  console.log(TerminalStylingUtils.setGreen(format(event.query)));

  if (event.params.length > 0) {
    console.log(
      TerminalStylingUtils.setGray('------------------------------------'),
    );
    console.log(TerminalStylingUtils.setYellow('Parameters:'));
    console.log(TerminalStylingUtils.setCyan(event.params));
  }
  console.log(
    TerminalStylingUtils.setGray('------------------------------------'),
  );
  console.log(TerminalStylingUtils.setYellow('Duration:'));
  console.log(TerminalStylingUtils.setMagenta(`${event.duration} ms\n`));
});
