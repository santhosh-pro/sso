FROM node:20

# Set locale settings
ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

# Update and install additional system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
       zsh git wget sudo gnupg2 software-properties-common iproute2 \
       openssh-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Update npm to a specific version
RUN npm i -g npm@10.2.4

# Install NestJS CLI and other global packages
RUN npm i -g @nestjs/cli@10.0.1 npm-check-updates plop@3.1.2

# Create a non-root user and grant sudo access
RUN useradd -m nodeuser \
    && echo "nodeuser ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Switch to the new user
USER nodeuser
WORKDIR /home/nodeuser

# Set up Oh My Zsh and Powerlevel10k theme
RUN git clone https://github.com/ohmyzsh/ohmyzsh.git ~/.oh-my-zsh \
    && cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc \
    && git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/.oh-my-zsh/custom/themes/powerlevel10k \
    && sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="powerlevel10k\/powerlevel10k"/' ~/.zshrc \
    && echo 'DISABLE_AUTO_UPDATE="true"' >> ~/.zshrc \
    && echo '[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh' >> ~/.zshrc

# Install Zsh plugins
RUN git clone https://github.com/zsh-users/zsh-autosuggestions.git ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions \
    && git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting \
    && sed -i 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting)/' ~/.zshrc \
    && echo 'DISABLE_UPDATE_PROMPT="true"' >> ~/.zshrc

# Create a default Powerlevel10k config to prevent the wizard
RUN echo 'POWERLEVEL9K_DISABLE_CONFIGURATION_WIZARD=true' > ~/.p10k.zsh \
    && echo 'source ~/.p10k.zsh' >> ~/.zshrc
    
# Fix permissions
RUN touch ~/.zsh_history && chmod 600 ~/.zsh_history

# Set default shell
CMD ["/usr/bin/zsh"]