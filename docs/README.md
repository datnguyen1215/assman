# Overview

This page contains all the information regarding the project's architecture, protocols, and APIs.

## Architecture

This is the architecture of the project where masters can control the slaves, provided that they're connected to the same LAN network.

![image](https://github.com/datnguyen1215/assman/assets/17491799/30d0dd26-6804-47dd-9da7-454e66c91ef5)

## Features

#### Auto-Discovery

Please refer to [this documentation](./discovery.md).

#### File Transfer

Please refer to [this documentation](!./file-transfer.md).

#### Command Line Execution

The Master can send commands to the Slaves to be executed and receive feedback (outputs). This is useful if we want to send files, expose files, run scripts or automation on the Slave machines, we can also install applications as well.

The point is to allow Master to have entire control of the Slaves, useful for QAs to run automation.

How it works:

1. Master sends a message to the Slaves (or collection of Slaves) command:run
2. Slave receives the message, execute the command using command line (shell or bash or whatever).
3. Slave finished the command, received outputs.
4. Slave responds back to the Master with the outputs.

#### Scripting

The Master is designed to have 2 components:

1. Server
2. Client

Please see their descriptions here.
