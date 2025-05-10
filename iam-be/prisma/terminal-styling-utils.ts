import chalk from 'chalk';
import * as figlet from 'figlet';

export const TerminalStylingUtils = {
  setBlue(message: string): string {
    return chalk.blue(message);
  },

  setGreen(message: string): string {
    return chalk.green(message);
  },
  setGray(message: string): string {
    return chalk.gray(message);
  },

  setCyan(message: string): string {
    return chalk.cyan(message);
  },

  setMagenta(message: string): string {
    return chalk.magenta(message);
  },

  setRed(message: string): string {
    return chalk.red(message);
  },

  setYellow(message: string): string {
    return chalk.yellow(message);
  },

  setBold(message: string): string {
    return chalk.bold(message);
  },

  setUnderline(message: string): string {
    return chalk.underline(message);
  },

  setBgBlue(message: string): string {
    return chalk.bgBlue(message);
  },

  setBgGreen(message: string): string {
    return chalk.bgGreen(message);
  },

  setColorBold: (data: string, hexColor: string): string => {
    return chalk.hex(hexColor).bold(data);
  },

  serverStartMessage: (
    host: string,
    message: string,
    mainColor: string,
    hostColor: string,
  ): string => {
    const display = `${message} ${chalk.hex(hostColor).bold(`${host} 🚀`)}`;
    return chalk.hex(mainColor).bold(display);
  },

  renderFigletMessage: (
    name: string,
    host: string,
    message: string,
    mainColor: string,
    hostColor: string,
    font: string = 'Mini',
    width: number = 120,
  ): void => {
    figlet.text(
      name,
      {
        font,
        horizontalLayout: 'fitted',
        verticalLayout: 'fitted',
        width,
        whitespaceBreak: true,
      },
      (err: any, data: any) => {
        if (err) {
          console.log('Something went wrong...');
          console.log(err);
          return;
        }
        console.log(TerminalStylingUtils.setColorBold(data, mainColor));
        console.log(
          TerminalStylingUtils.serverStartMessage(
            host,
            message,
            mainColor,
            hostColor,
          ),
        );
      },
    );
  },

  setCustomColor(message: string, color: string): string {
    return chalk.hex(color)(message);
  },
};
