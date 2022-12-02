/**
 * © Copyright IBM Corp. 2016, 2020 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

const defaultBindingsText = `// Define bindings as properties of the below object\n// Its possible to write any javascript expression here that evaluates to an object\n{\n // name: value \n}`;

export default {
  Networks: {
    json: [
      {
        Attachable: false,
        ConfigFrom: {
          Network: ""
        },
        ConfigOnly: false,
        Containers: {},
        Created: "2022-11-23T14:13:08.224043663+01:00",
        Driver: "bridge",
        EnableIPv6: false,
        IPAM: {
          Config: [
            {
              Gateway: "172.19.0.1",
              Subnet: "172.19.0.0/24"
            }
          ],
          Driver: "default",
          Options: null
        },
        Id: "0d891da4957f6e6e719418fd04317f9fdfe759094f124420c5b45a4dde45e062",
        Ingress: false,
        Internal: false,
        Labels: {
          "com.docker.compose.network": "br19",
          "com.docker.compose.project": "br19_ext_mapped_ports",
          "com.docker.compose.version": "2.10.2"
        },
        Name: "br19",
        Options: {},
        Portainer: {
          ResourceControl: {
            Id: 24,
            ResourceId: "2_br19_ext_mapped_ports",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Scope: "local"
      },
      {
        Attachable: false,
        ConfigFrom: {
          Network: ""
        },
        ConfigOnly: false,
        Containers: {},
        Created: "2021-12-03T22:26:48.926774654+01:00",
        Driver: "null",
        EnableIPv6: false,
        IPAM: {
          Config: [],
          Driver: "default",
          Options: null
        },
        Id: "493c237473bd8e21529af564dbfb0d42a48bd8fdd0c3d2ce75fc1fb8349deb66",
        Ingress: false,
        Internal: false,
        Labels: {},
        Name: "none",
        Options: {},
        Portainer: {
          ResourceControl: {
            Id: 0,
            ResourceId:
              "493c237473bd8e21529af564dbfb0d42a48bd8fdd0c3d2ce75fc1fb8349deb66",
            SubResourceIds: [],
            Type: 4,
            UserAccesses: [],
            TeamAccesses: [],
            Public: true,
            AdministratorsOnly: false,
            System: true
          }
        },
        Scope: "local"
      },
      {
        Attachable: false,
        ConfigFrom: {
          Network: ""
        },
        ConfigOnly: false,
        Containers: {},
        Created: "2022-11-23T14:19:30.810549503+01:00",
        Driver: "bridge",
        EnableIPv6: false,
        IPAM: {
          Config: [
            {
              Gateway: "172.20.0.1",
              Subnet: "172.20.0.0/24"
            }
          ],
          Driver: "default",
          Options: null
        },
        Id: "96b7f1d0077cc89982c6150f9c3f83018e62ba07e97ac4be4aaa107333e196a9",
        Ingress: false,
        Internal: false,
        Labels: {
          "com.docker.compose.network": "br20_appnet",
          "com.docker.compose.project": "br20_apps",
          "com.docker.compose.version": "2.10.2"
        },
        Name: "br20_appnet",
        Options: {},
        Portainer: {
          ResourceControl: {
            Id: 22,
            ResourceId: "2_br20_apps",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Scope: "local"
      },
      {
        Attachable: false,
        ConfigFrom: {
          Network: ""
        },
        ConfigOnly: false,
        Containers: {},
        Created: "2021-12-03T22:26:48.951482121+01:00",
        Driver: "host",
        EnableIPv6: false,
        IPAM: {
          Config: [],
          Driver: "default",
          Options: null
        },
        Id: "99ee56679eb717296a6ca493dc22451867c3a6307e02e20990680be5bdbb4abb",
        Ingress: false,
        Internal: false,
        Labels: {},
        Name: "host",
        Options: {},
        Portainer: {
          ResourceControl: {
            Id: 0,
            ResourceId:
              "99ee56679eb717296a6ca493dc22451867c3a6307e02e20990680be5bdbb4abb",
            SubResourceIds: [],
            Type: 4,
            UserAccesses: [],
            TeamAccesses: [],
            Public: true,
            AdministratorsOnly: false,
            System: true
          }
        },
        Scope: "local"
      },
      {
        Attachable: false,
        ConfigFrom: {
          Network: ""
        },
        ConfigOnly: false,
        Containers: {},
        Created: "2022-11-28T14:19:56.246272278+01:00",
        Driver: "bridge",
        EnableIPv6: false,
        IPAM: {
          Config: [
            {
              Gateway: "172.17.0.1",
              Subnet: "172.17.0.0/16"
            }
          ],
          Driver: "default",
          Options: null
        },
        Id: "2f1abe608bf947c352ec8ca719571f044cf8675694e7cb0e28965d3df0104ff4",
        Ingress: false,
        Internal: false,
        Labels: {},
        Name: "bridge",
        Options: {
          "com.docker.network.bridge.default_bridge": "true",
          "com.docker.network.bridge.enable_icc": "true",
          "com.docker.network.bridge.enable_ip_masquerade": "true",
          "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
          "com.docker.network.bridge.name": "docker0",
          "com.docker.network.driver.mtu": "1500"
        },
        Portainer: {
          ResourceControl: {
            Id: 0,
            ResourceId:
              "2f1abe608bf947c352ec8ca719571f044cf8675694e7cb0e28965d3df0104ff4",
            SubResourceIds: [],
            Type: 4,
            UserAccesses: [],
            TeamAccesses: [],
            Public: true,
            AdministratorsOnly: false,
            System: true
          }
        },
        Scope: "local"
      }
    ],
    jsonata: "$",
    bindings: defaultBindingsText
  },
  Stacks: {
    json: [
      {
        Id: 52,
        Name: "br20_apps",
        Type: 2,
        EndpointId: 2,
        SwarmId: "",
        EntryPoint: "docker-compose.yml",
        Env: [],
        ResourceControl: {
          Id: 22,
          ResourceId: "2_br20_apps",
          SubResourceIds: [],
          Type: 6,
          UserAccesses: [],
          TeamAccesses: [],
          Public: false,
          AdministratorsOnly: true,
          System: false
        },
        Status: 1,
        ProjectPath: "/data/compose/52",
        CreationDate: 1656319467,
        CreatedBy: "admin",
        UpdateDate: 1669414337,
        UpdatedBy: "admin",
        AdditionalFiles: null,
        AutoUpdate: null,
        Option: null,
        GitConfig: null,
        FromAppTemplate: false,
        Namespace: "",
        IsComposeFormat: false,
        Webhook: ""
      },
      {
        Id: 56,
        Name: "br19_ext_mapped_ports",
        Type: 2,
        EndpointId: 2,
        SwarmId: "",
        EntryPoint: "docker-compose.yml",
        Env: [],
        ResourceControl: {
          Id: 24,
          ResourceId: "2_br19_ext_mapped_ports",
          SubResourceIds: [],
          Type: 6,
          UserAccesses: [],
          TeamAccesses: [],
          Public: false,
          AdministratorsOnly: true,
          System: false
        },
        Status: 1,
        ProjectPath: "/data/compose/56",
        CreationDate: 1656328838,
        CreatedBy: "admin",
        UpdateDate: 1668202251,
        UpdatedBy: "admin",
        AdditionalFiles: null,
        AutoUpdate: null,
        Option: null,
        GitConfig: null,
        FromAppTemplate: false,
        Namespace: "",
        IsComposeFormat: false,
        Webhook: ""
      }
    ],
    jsonata: "$",
    bindings: defaultBindingsText
  },
  Containers: {
    json: [
      {
        Command: "ttn-lw-stack -c /config/ttn-lw-stack-docker.yml start",
        Created: 1669848467,
        HostConfig: {
          NetworkMode: "br19"
        },
        Id: "46bc571c2b556a6d24ca380a3d1c05e9fdc665e82c4e35d780676af2b5ba3031",
        Image: "thethingsnetwork/lorawan-stack:3.22.2",
        ImageID:
          "sha256:92e307e551c785493383a879564de2ae7cb53b13c1056b8df0ee44c755765849",
        Labels: {
          "com.docker.compose.config-hash":
            "5e3e15f9c0ec438a54a340d6394724d105e0db07168c2b8c2fc22d5cca923a95",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.depends_on":
            "redis:service_started,postgres:service_started",
          "com.docker.compose.image":
            "sha256:92e307e551c785493383a879564de2ae7cb53b13c1056b8df0ee44c755765849",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "br19_ext_mapped_ports",
          "com.docker.compose.project.config_files":
            "/data/compose/56/docker-compose.yml",
          "com.docker.compose.project.working_dir": "/data/compose/56",
          "com.docker.compose.service": "tts",
          "com.docker.compose.version": "2.10.2",
          "org.opencontainers.image.created": "2022-11-10T13:51:07Z",
          "org.opencontainers.image.revision":
            "33e03d104aa8bd57f0e34a3597ab5c5648ec0a10",
          "org.opencontainers.image.title": "The Things Stack",
          "org.opencontainers.image.url":
            "https://www.thethingsindustries.com/docs",
          "org.opencontainers.image.vendor": "The Things Network Foundation",
          "org.opencontainers.image.version": "3.22.2"
        },
        Mounts: [
          {
            Destination: "/srv/ttn-lorawan/public/blob",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/tts/blob",
            Type: "bind"
          },
          {
            Destination: "/var/lib/acme",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/tts/acme",
            Type: "bind"
          },
          {
            Destination: "/config",
            Mode: "ro",
            Propagation: "rprivate",
            RW: false,
            Source: "/root/tts/config/stack",
            Type: "bind"
          }
        ],
        Names: ["/tts"],
        NetworkSettings: {
          Networks: {
            br19: {
              Aliases: null,
              DriverOpts: null,
              EndpointID:
                "17e93641f7561e5abd18b5d978047f3b7c47169b00bd27b4067509a0a4c2a6c2",
              Gateway: "172.19.0.1",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: {
                IPv4Address: "172.19.0.23"
              },
              IPAddress: "172.19.0.23",
              IPPrefixLen: 24,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "02:42:ac:13:00:17",
              NetworkID:
                "f876cd20729e4d70db64f538bb56f0c164a7e428f9669a81146d1e1b25132aa4"
            }
          }
        },
        Portainer: {
          ResourceControl: {
            Id: 24,
            ResourceId: "2_br19_ext_mapped_ports",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Ports: [
          {
            PrivatePort: 8884,
            Type: "tcp"
          },
          {
            IP: "0.0.0.0",
            PrivatePort: 8886,
            PublicPort: 8886,
            Type: "tcp"
          },
          {
            PrivatePort: 1881,
            Type: "tcp"
          },
          {
            PrivatePort: 1883,
            Type: "tcp"
          },
          {
            PrivatePort: 1885,
            Type: "tcp"
          },
          {
            IP: "0.0.0.0",
            PrivatePort: 8881,
            PublicPort: 8881,
            Type: "tcp"
          },
          {
            PrivatePort: 1700,
            Type: "udp"
          },
          {
            IP: "0.0.0.0",
            PrivatePort: 8882,
            PublicPort: 8882,
            Type: "tcp"
          },
          {
            PrivatePort: 8883,
            Type: "tcp"
          },
          {
            IP: "0.0.0.0",
            PrivatePort: 8885,
            PublicPort: 8885,
            Type: "tcp"
          },
          {
            PrivatePort: 1882,
            Type: "tcp"
          },
          {
            PrivatePort: 1884,
            Type: "tcp"
          },
          {
            PrivatePort: 1887,
            Type: "tcp"
          },
          {
            IP: "0.0.0.0",
            PrivatePort: 8887,
            PublicPort: 8887,
            Type: "tcp"
          }
        ],
        State: "running",
        Status: "Up 33 hours (healthy)"
      },
      {
        Command: "docker-entrypoint.sh postgres",
        Created: 1669848467,
        HostConfig: {
          NetworkMode: "br19"
        },
        Id: "017908d5013f7a6e2233001a98eab5225ec7ee04b925211ea2d26a292571baba",
        Image: "postgres:bullseye",
        ImageID:
          "sha256:027eba2e89396946fd63dd69c919844b248c8b591c07545321de3006503cc974",
        Labels: {
          "com.docker.compose.config-hash":
            "6f91fa3ab3878053f1e2d6212f9f2cb3f80167899e669cb58304957df4ab3a89",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.depends_on": "",
          "com.docker.compose.image":
            "sha256:027eba2e89396946fd63dd69c919844b248c8b591c07545321de3006503cc974",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "br19_ext_mapped_ports",
          "com.docker.compose.project.config_files":
            "/data/compose/56/docker-compose.yml",
          "com.docker.compose.project.working_dir": "/data/compose/56",
          "com.docker.compose.service": "postgres",
          "com.docker.compose.version": "2.10.2"
        },
        Mounts: [
          {
            Destination: "/var/lib/postgresql/data",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/data/compose/56/.env/data/postgres",
            Type: "bind"
          }
        ],
        Names: ["/postgres"],
        NetworkSettings: {
          Networks: {
            br19: {
              Aliases: null,
              DriverOpts: null,
              EndpointID:
                "0eaf173d68ef2b23a398253b31b2e10220cdbc75b9ec669b61c81e57e567b8ea",
              Gateway: "172.19.0.1",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: {
                IPv4Address: "172.19.0.21"
              },
              IPAddress: "172.19.0.21",
              IPPrefixLen: 24,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "02:42:ac:13:00:15",
              NetworkID:
                "f876cd20729e4d70db64f538bb56f0c164a7e428f9669a81146d1e1b25132aa4"
            }
          }
        },
        Portainer: {
          ResourceControl: {
            Id: 24,
            ResourceId: "2_br19_ext_mapped_ports",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Ports: [
          {
            PrivatePort: 5432,
            Type: "tcp"
          }
        ],
        State: "running",
        Status: "Up 33 hours"
      },
      {
        Command: "docker-entrypoint.sh redis-server --appendonly yes",
        Created: 1669848467,
        HostConfig: {
          NetworkMode: "br19"
        },
        Id: "e31ba5f1c0d70a5045d3c2c0ad5a47577d5838cbefe7a128eaec1786f6504e8d",
        Image: "redis:latest",
        ImageID:
          "sha256:c2342258f8ca7ab5af86e82df6e9ade908a949216679667b0f39b59bcd38c4e9",
        Labels: {
          "com.docker.compose.config-hash":
            "bec2b58f53a479596b1ec72a92b44c6754b804da61ffc6850d4b7dd46d63b01a",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.depends_on": "",
          "com.docker.compose.image":
            "sha256:c2342258f8ca7ab5af86e82df6e9ade908a949216679667b0f39b59bcd38c4e9",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "br19_ext_mapped_ports",
          "com.docker.compose.project.config_files":
            "/data/compose/56/docker-compose.yml",
          "com.docker.compose.project.working_dir": "/data/compose/56",
          "com.docker.compose.service": "redis",
          "com.docker.compose.version": "2.10.2"
        },
        Mounts: [
          {
            Destination: "/data",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/data/compose/56/.env/data/redis",
            Type: "bind"
          }
        ],
        Names: ["/redis"],
        NetworkSettings: {
          Networks: {
            br19: {
              Aliases: null,
              DriverOpts: null,
              EndpointID:
                "c1f0a3ba199c6d64df6a677ba0b3c40c39561200ec6ace9a60a8231ba3aca068",
              Gateway: "172.19.0.1",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: {
                IPv4Address: "172.19.0.22"
              },
              IPAddress: "172.19.0.22",
              IPPrefixLen: 24,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "02:42:ac:13:00:16",
              NetworkID:
                "f876cd20729e4d70db64f538bb56f0c164a7e428f9669a81146d1e1b25132aa4"
            }
          }
        },
        Portainer: {
          ResourceControl: {
            Id: 24,
            ResourceId: "2_br19_ext_mapped_ports",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Ports: [
          {
            PrivatePort: 6379,
            Type: "tcp"
          }
        ],
        State: "running",
        Status: "Up 33 hours"
      },
      {
        Command: "mkdocs serve --dev-addr=0.0.0.0:8000",
        Created: 1669414336,
        HostConfig: {
          NetworkMode: "br20_appnet"
        },
        Id: "44b78a4282d1b2a7bd9a5d1f0a1e94697f4b2bf2f71e849961b5d6d2d6dd69d4",
        Image: "squidfunk/mkdocs-material",
        ImageID:
          "sha256:576030382b07cd8c36c6a62281b52280f57c62b568b5003227713184040e7c0d",
        Labels: {
          "com.docker.compose.config-hash":
            "91e529f8451c58e0adcbd1a90381881b6cb7245fb955c6f688ab925d7f04edb8",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.depends_on": "",
          "com.docker.compose.image":
            "sha256:576030382b07cd8c36c6a62281b52280f57c62b568b5003227713184040e7c0d",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "br20_apps",
          "com.docker.compose.project.config_files":
            "/data/compose/52/docker-compose.yml",
          "com.docker.compose.project.working_dir": "/data/compose/52",
          "com.docker.compose.service": "docs",
          "com.docker.compose.version": "2.10.2"
        },
        Mounts: [
          {
            Destination: "/docs",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/mmkdocs",
            Type: "bind"
          }
        ],
        Names: ["/docs"],
        NetworkSettings: {
          Networks: {
            br20_appnet: {
              Aliases: null,
              DriverOpts: null,
              EndpointID:
                "f3a334fca34ee192f90957336a712f24cc5bf755be7ba0666208cb351ab7feeb",
              Gateway: "172.20.0.1",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: {
                IPv4Address: "172.20.0.21"
              },
              IPAddress: "172.20.0.21",
              IPPrefixLen: 24,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "02:42:ac:14:00:15",
              NetworkID:
                "96b7f1d0077cc89982c6150f9c3f83018e62ba07e97ac4be4aaa107333e196a9"
            }
          }
        },
        Portainer: {
          ResourceControl: {
            Id: 22,
            ResourceId: "2_br20_apps",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Ports: [
          {
            PrivatePort: 8000,
            Type: "tcp"
          }
        ],
        State: "running",
        Status: "Up 3 days"
      },
      {
        Command: "docker-entrypoint.sh npm start",
        Created: 1669209571,
        HostConfig: {
          NetworkMode: "br20_appnet"
        },
        Id: "c730befa9582c295889dcba3194a6ac6fcbeb3e04a747ba65b7ebe3cad1a4a12",
        Image: "frangoteam/fuxa:latest",
        ImageID:
          "sha256:f60faf86080f020f271972a218afa310e0f210ebd1856363ceee6a90b37940c0",
        Labels: {
          "com.docker.compose.config-hash":
            "8bcf00b6f7094195e7b7e28fb3dd61e223f7a05731cbae328728a808584b7d0e",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.depends_on": "",
          "com.docker.compose.image":
            "sha256:f60faf86080f020f271972a218afa310e0f210ebd1856363ceee6a90b37940c0",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "br20_apps",
          "com.docker.compose.project.config_files":
            "/data/compose/52/docker-compose.yml",
          "com.docker.compose.project.working_dir": "/data/compose/52",
          "com.docker.compose.service": "fuxa",
          "com.docker.compose.version": "2.10.2",
          "traefik.enable": "true",
          "traefik.http.routers.fuxa.entrypoints": "websecure",
          "traefik.http.routers.fuxa.rule": "Host(`fuxa.berzek.com`)",
          "traefik.http.routers.fuxa.service": "fuxa",
          "traefik.http.routers.fuxa.tls.certresolver": "leresolver",
          "traefik.http.services.fuxa.loadbalancer.server.port": "1881"
        },
        Mounts: [
          {
            Destination: "/usr/src/app/FUXA/client/assets/lib/svgeditor/shapes",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/fuxa/shapes",
            Type: "bind"
          },
          {
            Destination: "/usr/src/app/FUXA/server/_appdata",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/fuxa/appdata",
            Type: "bind"
          },
          {
            Destination: "/usr/src/app/FUXA/server/_db",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/fuxa/db",
            Type: "bind"
          },
          {
            Destination: "/usr/src/app/FUXA/server/_images",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/fuxa/images",
            Type: "bind"
          },
          {
            Destination: "/usr/src/app/FUXA/server/_logs",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/fuxa/logs",
            Type: "bind"
          }
        ],
        Names: ["/fuxa"],
        NetworkSettings: {
          Networks: {
            br20_appnet: {
              Aliases: null,
              DriverOpts: null,
              EndpointID:
                "8e454585b204f2a34d066732e689c215844ac6c7cfd27b27a1a54d7db5643f7a",
              Gateway: "172.20.0.1",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: {
                IPv4Address: "172.20.0.81"
              },
              IPAddress: "172.20.0.81",
              IPPrefixLen: 24,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "02:42:ac:14:00:51",
              NetworkID:
                "96b7f1d0077cc89982c6150f9c3f83018e62ba07e97ac4be4aaa107333e196a9"
            }
          }
        },
        Portainer: {
          ResourceControl: {
            Id: 22,
            ResourceId: "2_br20_apps",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Ports: [
          {
            PrivatePort: 1881,
            Type: "tcp"
          }
        ],
        State: "running",
        Status: "Up 3 days"
      },
      {
        Command:
          "/entrypoint.sh --entrypoints.web.address=:80 --entrypoints.websecure.address=:443 --providers.docker=true --providers.docker.exposedbydefault=false --api.dashboard=true --api.insecure=true --log.level=DEBUG --certificatesresolvers.leresolver.acme.httpchallenge=true --certificatesresolvers.leresolver.acme.email=prox4mail@berzek.com --certificatesresolvers.leresolver.acme.storage=/letsencrypt/acme.json --certificatesresolvers.leresolver.acme.httpchallenge.entrypoint=web",
        Created: 1669209571,
        HostConfig: {
          NetworkMode: "br20_appnet"
        },
        Id: "a8ba4047a0fbfdee6d45391b4bbacafd3fa67177efad5d24018143c50ef4d892",
        Image: "traefik:v2.9.4",
        ImageID:
          "sha256:288889429becfa205fc2887f5b51e8b53d3c32021b7614d350ff54ce88bbd4a8",
        Labels: {
          "com.docker.compose.config-hash":
            "eca3eaea106fcfbc4d50880c8eb84351b79e83058d73ca47f0c3569a0731b093",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.depends_on": "",
          "com.docker.compose.image":
            "sha256:288889429becfa205fc2887f5b51e8b53d3c32021b7614d350ff54ce88bbd4a8",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "br20_apps",
          "com.docker.compose.project.config_files":
            "/data/compose/52/docker-compose.yml",
          "com.docker.compose.project.working_dir": "/data/compose/52",
          "com.docker.compose.service": "traefik",
          "com.docker.compose.version": "2.10.2",
          "org.opencontainers.image.description": "A modern reverse-proxy",
          "org.opencontainers.image.documentation": "https://docs.traefik.io",
          "org.opencontainers.image.source":
            "https://github.com/traefik/traefik",
          "org.opencontainers.image.title": "Traefik",
          "org.opencontainers.image.url": "https://traefik.io",
          "org.opencontainers.image.vendor": "Traefik Labs",
          "org.opencontainers.image.version": "v2.9.4",
          "traefik.enable": "true",
          "traefik.http.routers.http-catchall.entrypoints": "web",
          "traefik.http.routers.http-catchall.middlewares": "redirect-to-https",
          "traefik.http.routers.http-catchall.rule": "hostregexp(`{host:.+}`)"
        },
        Mounts: [
          {
            Destination: "/var/run/docker.sock",
            Mode: "ro",
            Propagation: "rprivate",
            RW: false,
            Source: "/var/run/docker.sock",
            Type: "bind"
          },
          {
            Destination: "/letsencrypt",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/letsencrypt",
            Type: "bind"
          }
        ],
        Names: ["/traefik"],
        NetworkSettings: {
          Networks: {
            br20_appnet: {
              Aliases: null,
              DriverOpts: null,
              EndpointID:
                "c09bbaf6c7fb37277f939ee0fbf554dc269efe75d5536757a5a9610110f208b3",
              Gateway: "172.20.0.1",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: {
                IPv4Address: "172.20.0.2"
              },
              IPAddress: "172.20.0.2",
              IPPrefixLen: 24,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "02:42:ac:14:00:02",
              NetworkID:
                "96b7f1d0077cc89982c6150f9c3f83018e62ba07e97ac4be4aaa107333e196a9"
            }
          }
        },
        Portainer: {
          ResourceControl: {
            Id: 22,
            ResourceId: "2_br20_apps",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Ports: [
          {
            IP: "0.0.0.0",
            PrivatePort: 443,
            PublicPort: 443,
            Type: "tcp"
          },
          {
            IP: "0.0.0.0",
            PrivatePort: 80,
            PublicPort: 80,
            Type: "tcp"
          }
        ],
        State: "running",
        Status: "Up 3 days"
      },
      {
        Command:
          // eslint-disable-next-line
          "/docker-entrypoint.sh /bin/sh -c '/bin/sh -c \"   envsubst '\\${SERVER_HOST} \\${SERVER_PORT} \\${LISTEN_PORT}'   < /etc/nginx/nginx.tmpl   > /etc/nginx/nginx.conf   && nginx -g 'daemon off;'   || ( env; cat /etc/nginx/nginx.conf )   \"'",
        Created: 1669209571,
        HostConfig: {
          NetworkMode: "br20_appnet"
        },
        Id: "f5f7b5d8e3b17011e8c346f9da6ca54a1ae8e25e29c9001d4579b94c7ebdd4e6",
        Image: "owntracks/frontend:latest",
        ImageID:
          "sha256:1ca7663e3935834d00ca1f30db48fb3fa70158e562ab7753bb0dca4007f93dae",
        Labels: {
          "com.docker.compose.config-hash":
            "966fdb973eef7bfa2635b65614ea2184c9782e8df7908f918c2edb9fc5f6678f",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.depends_on": "",
          "com.docker.compose.image":
            "sha256:1ca7663e3935834d00ca1f30db48fb3fa70158e562ab7753bb0dca4007f93dae",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "br20_apps",
          "com.docker.compose.project.config_files":
            "/data/compose/52/docker-compose.yml",
          "com.docker.compose.project.working_dir": "/data/compose/52",
          "com.docker.compose.service": "owntracks-fe",
          "com.docker.compose.version": "2.10.2",
          description: "OwnTracks Frontend",
          maintainer: "Linus Groh <mail@linusgroh.de>",
          "traefik.enable": "true",
          "traefik.http.routers.owntracks-fe.entrypoints": "websecure",
          "traefik.http.routers.owntracks-fe.rule": "Host(`ot.berzek.com`)",
          "traefik.http.routers.owntracks-fe.service": "owntracks-fe",
          "traefik.http.routers.owntracks-fe.tls.certresolver": "leresolver",
          "traefik.http.services.owntracks-fe.loadbalancer.server.port": "80",
          version: "2.12.0"
        },
        Mounts: [
          {
            Destination: "/usr/share/nginx/html/config/config.js",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/ot/fe",
            Type: "bind"
          }
        ],
        Names: ["/owntracks-fe"],
        NetworkSettings: {
          Networks: {
            br20_appnet: {
              Aliases: null,
              DriverOpts: null,
              EndpointID:
                "fe870828b599deacf87be05ee855d54dac558d20cb430535288b7ea98427f80c",
              Gateway: "172.20.0.1",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: {
                IPv4Address: "172.20.0.53"
              },
              IPAddress: "172.20.0.53",
              IPPrefixLen: 24,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "02:42:ac:14:00:35",
              NetworkID:
                "96b7f1d0077cc89982c6150f9c3f83018e62ba07e97ac4be4aaa107333e196a9"
            }
          }
        },
        Portainer: {
          ResourceControl: {
            Id: 22,
            ResourceId: "2_br20_apps",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Ports: [
          {
            PrivatePort: 80,
            Type: "tcp"
          }
        ],
        State: "running",
        Status: "Up 3 days"
      },
      {
        Command: "./entrypoint.sh",
        Created: 1669209571,
        HostConfig: {
          NetworkMode: "br20_appnet"
        },
        Id: "3395f9dd0ddd20d7930f1e28302448980fb1d5d50b0c1b23507705a5e7aa4ce3",
        Image: "nodered/node-red:latest",
        ImageID:
          "sha256:a15fc0f4e93018b7b6633639139a6fc1c6e13ca9275a6825cbecb6a4d2a85c57",
        Labels: {
          authors:
            "Dave Conway-Jones, Nick O'Leary, James Thomas, Raymond Mouthaan",
          "com.docker.compose.config-hash":
            "256c56ca5c0d30b9cba0907ffed5e904ec91daee9aca2c40ad820a4fc5c63ed0",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.depends_on": "",
          "com.docker.compose.image":
            "sha256:a15fc0f4e93018b7b6633639139a6fc1c6e13ca9275a6825cbecb6a4d2a85c57",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "br20_apps",
          "com.docker.compose.project.config_files":
            "/data/compose/52/docker-compose.yml",
          "com.docker.compose.project.working_dir": "/data/compose/52",
          "com.docker.compose.service": "nodered",
          "com.docker.compose.version": "2.10.2",
          "org.label-schema.arch": "",
          "org.label-schema.build-date": "2022-08-04T13:19:23Z",
          "org.label-schema.description":
            "Low-code programming for event-driven applications.",
          "org.label-schema.docker.dockerfile": ".docker/Dockerfile.alpine",
          "org.label-schema.license": "Apache-2.0",
          "org.label-schema.name": "Node-RED",
          "org.label-schema.url": "https://nodered.org",
          "org.label-schema.vcs-ref": "",
          "org.label-schema.vcs-type": "Git",
          "org.label-schema.vcs-url":
            "https://github.com/node-red/node-red-docker",
          "org.label-schema.version": "3.0.2",
          "traefik.enable": "true",
          "traefik.http.routers.nodered.entrypoints": "websecure",
          "traefik.http.routers.nodered.rule": "Host(`nr.berzek.com`)",
          "traefik.http.routers.nodered.service": "nodered",
          "traefik.http.routers.nodered.tls.certresolver": "leresolver",
          "traefik.http.services.nodered.loadbalancer.server.port": "1880"
        },
        Mounts: [
          {
            Destination: "/data",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/nodered/data",
            Type: "bind"
          }
        ],
        Names: ["/nodered"],
        NetworkSettings: {
          Networks: {
            br20_appnet: {
              Aliases: null,
              DriverOpts: null,
              EndpointID:
                "aa48a4e00103e783498435595abcc7c6425e7ae7bd01f62edc9e8d593066666a",
              Gateway: "172.20.0.1",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: {
                IPv4Address: "172.20.0.24"
              },
              IPAddress: "172.20.0.24",
              IPPrefixLen: 24,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "02:42:ac:14:00:18",
              NetworkID:
                "96b7f1d0077cc89982c6150f9c3f83018e62ba07e97ac4be4aaa107333e196a9"
            }
          }
        },
        Portainer: {
          ResourceControl: {
            Id: 22,
            ResourceId: "2_br20_apps",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Ports: [
          {
            PrivatePort: 1880,
            Type: "tcp"
          }
        ],
        State: "running",
        Status: "Up 3 days (healthy)"
      },
      {
        Command: "/docker-entrypoint.sh catalina.sh run",
        Created: 1669209571,
        HostConfig: {
          NetworkMode: "br20_appnet"
        },
        Id: "da6dfe5a4e727f64f918f1c9fb33a191bfb9e08f6c9c8f7c5043766753b29bfa",
        Image: "jgraph/drawio",
        ImageID:
          "sha256:0e441b64d6e505fee6a58751d0f0a245340579f3214867e6717726438b77a800",
        Labels: {
          "com.docker.compose.config-hash":
            "82725efbb47191446d001e3f7935ab79e18087d6313fdde3be4bf514db7f1eb2",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.depends_on": "",
          "com.docker.compose.image":
            "sha256:0e441b64d6e505fee6a58751d0f0a245340579f3214867e6717726438b77a800",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "br20_apps",
          "com.docker.compose.project.config_files":
            "/data/compose/52/docker-compose.yml",
          "com.docker.compose.project.working_dir": "/data/compose/52",
          "com.docker.compose.service": "drawio",
          "com.docker.compose.version": "2.10.2",
          maintainer: "JGraph Ltd",
          "traefik.enable": "true",
          "traefik.http.routers.drawio.entrypoints": "websecure",
          "traefik.http.routers.drawio.rule": "Host(`drawio.berzek.com`)",
          "traefik.http.routers.drawio.service": "drawio",
          "traefik.http.routers.drawio.tls.certresolver": "leresolver",
          "traefik.http.services.drawio.loadbalancer.server.port": "8080"
        },
        Mounts: [],
        Names: ["/drawio"],
        NetworkSettings: {
          Networks: {
            br20_appnet: {
              Aliases: null,
              DriverOpts: null,
              EndpointID:
                "ccdcead82acc3b560a433baba285b65edc6ff1ab047532e198bc7d42ff547b20",
              Gateway: "172.20.0.1",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: {
                IPv4Address: "172.20.0.71"
              },
              IPAddress: "172.20.0.71",
              IPPrefixLen: 24,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "02:42:ac:14:00:47",
              NetworkID:
                "96b7f1d0077cc89982c6150f9c3f83018e62ba07e97ac4be4aaa107333e196a9"
            }
          }
        },
        Portainer: {
          ResourceControl: {
            Id: 22,
            ResourceId: "2_br20_apps",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Ports: [
          {
            PrivatePort: 8080,
            Type: "tcp"
          },
          {
            PrivatePort: 8443,
            Type: "tcp"
          }
        ],
        State: "running",
        Status: "Up 3 days (healthy)"
      },
      {
        Command: "/docker-entrypoint.sh nginx -g 'daemon off;'",
        Created: 1669209571,
        HostConfig: {
          NetworkMode: "br20_appnet"
        },
        Id: "733a433e92e8526cd20dbf6a3618f187756aa2a4c852900fe79db4c6ebbb82c1",
        Image: "excalidraw/excalidraw:latest",
        ImageID:
          "sha256:99e6d5aed2018893ebea0891b0579a57fe9e7a087c71e10277365a9696004921",
        Labels: {
          "com.docker.compose.config-hash":
            "f4924dc901c5b561bc6960475bc01047baaaae29c440604ff59d2155238e642e",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.depends_on": "",
          "com.docker.compose.image":
            "sha256:99e6d5aed2018893ebea0891b0579a57fe9e7a087c71e10277365a9696004921",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "br20_apps",
          "com.docker.compose.project.config_files":
            "/data/compose/52/docker-compose.yml",
          "com.docker.compose.project.working_dir": "/data/compose/52",
          "com.docker.compose.service": "excalidraw",
          "com.docker.compose.version": "2.10.2",
          maintainer: "NGINX Docker Maintainers <docker-maint@nginx.com>",
          "traefik.enable": "true",
          "traefik.http.routers.excalidraw.entrypoints": "websecure",
          "traefik.http.routers.excalidraw.rule": "Host(`ed.berzek.com`)",
          "traefik.http.routers.excalidraw.service": "excalidraw",
          "traefik.http.routers.excalidraw.tls.certresolver": "leresolver",
          "traefik.http.services.excalidraw.loadbalancer.server.port": "80"
        },
        Mounts: [
          {
            Destination: "/opt/node_app/app",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/excalidraw",
            Type: "bind"
          },
          {
            Destination: "/opt/node_app/app/node_modules",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/excalidraw",
            Type: "bind"
          },
          {
            Destination: "/opt/node_app/package.json",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/excalidraw",
            Type: "bind"
          },
          {
            Destination: "/opt/node_app/yarn.lock",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/excalidraw",
            Type: "bind"
          }
        ],
        Names: ["/excalidraw"],
        NetworkSettings: {
          Networks: {
            br20_appnet: {
              Aliases: null,
              DriverOpts: null,
              EndpointID:
                "22cb0eeba466c2663226423f17080d672c6ec7ae1a6f41eefef75bcf36c73442",
              Gateway: "172.20.0.1",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: {
                IPv4Address: "172.20.0.91"
              },
              IPAddress: "172.20.0.91",
              IPPrefixLen: 24,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "02:42:ac:14:00:5b",
              NetworkID:
                "96b7f1d0077cc89982c6150f9c3f83018e62ba07e97ac4be4aaa107333e196a9"
            }
          }
        },
        Portainer: {
          ResourceControl: {
            Id: 22,
            ResourceId: "2_br20_apps",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Ports: [
          {
            PrivatePort: 80,
            Type: "tcp"
          }
        ],
        State: "running",
        Status: "Up 3 days (healthy)"
      },
      {
        Command: "docker-entrypoint.sh mongod",
        Created: 1669209570,
        HostConfig: {
          NetworkMode: "br20_appnet"
        },
        Id: "05df270a13a73a61eb74e4758b5c02b3c10b62042be8e48eeff156e441b79357",
        Image: "mongo",
        ImageID:
          "sha256:b70536aeb2507ba0ea53767d15d836e140ccf3df74f2678f0cb5dd5c5e1d952c",
        Labels: {
          "com.docker.compose.config-hash":
            "e262b98226b2f8339ceda7fb84ff43e7da98cb7296a5a19ed361acfb136ca8ba",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.depends_on": "",
          "com.docker.compose.image":
            "sha256:b70536aeb2507ba0ea53767d15d836e140ccf3df74f2678f0cb5dd5c5e1d952c",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "br20_apps",
          "com.docker.compose.project.config_files":
            "/data/compose/52/docker-compose.yml",
          "com.docker.compose.project.working_dir": "/data/compose/52",
          "com.docker.compose.service": "mongodb",
          "com.docker.compose.version": "2.10.2"
        },
        Mounts: [
          {
            Destination: "/data/configdb",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/mongodb/config",
            Type: "bind"
          },
          {
            Destination: "/data/db",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/mongodb/data",
            Type: "bind"
          },
          {
            Destination: "/etc/mongo",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/mongodb",
            Type: "bind"
          }
        ],
        Names: ["/mongodb"],
        NetworkSettings: {
          Networks: {
            br20_appnet: {
              Aliases: null,
              DriverOpts: null,
              EndpointID:
                "f3f0b217c382da70cf6c4d751571477b76e006b743fa5a196b2a45549f54c563",
              Gateway: "172.20.0.1",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: {
                IPv4Address: "172.20.0.25"
              },
              IPAddress: "172.20.0.25",
              IPPrefixLen: 24,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "02:42:ac:14:00:19",
              NetworkID:
                "96b7f1d0077cc89982c6150f9c3f83018e62ba07e97ac4be4aaa107333e196a9"
            }
          }
        },
        Portainer: {
          ResourceControl: {
            Id: 22,
            ResourceId: "2_br20_apps",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Ports: [
          {
            PrivatePort: 27017,
            Type: "tcp"
          }
        ],
        State: "running",
        Status: "Up 3 days"
      },
      {
        Command: "/opt/appsmith/entrypoint.sh /usr/bin/supervisord -n",
        Created: 1669209570,
        HostConfig: {
          NetworkMode: "br20_appnet"
        },
        Id: "4727d5758ff71d59207a6de0b912a308b2bba4855545ff3271184d263c41d1e7",
        Image: "index.docker.io/appsmith/appsmith-ce",
        ImageID:
          "sha256:60e16d4793880cc816fddcf01bb335d1617e163952929a07889f36af0dff75b0",
        Labels: {
          "com.centurylinklabs.watchtower.lifecycle.pre-check":
            "/watchtower-hooks/pre-check.sh",
          "com.centurylinklabs.watchtower.lifecycle.pre-update":
            "/watchtower-hooks/pre-update.sh",
          "com.docker.compose.config-hash":
            "f154e4bb12442da04198311d8e5a5b4218d33689f2d8df5895ab44d5179d7b1a",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.depends_on": "",
          "com.docker.compose.image":
            "sha256:60e16d4793880cc816fddcf01bb335d1617e163952929a07889f36af0dff75b0",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "br20_apps",
          "com.docker.compose.project.config_files":
            "/data/compose/52/docker-compose.yml",
          "com.docker.compose.project.working_dir": "/data/compose/52",
          "com.docker.compose.service": "appsmith",
          "com.docker.compose.version": "2.10.2",
          maintainer: "tech@appsmith.com",
          "traefik.enable": "false",
          "traefik.http.routers.appsmith.entrypoints": "websecure",
          "traefik.http.routers.appsmith.rule": "Host(`apps.berzek.com`)",
          "traefik.http.routers.appsmith.service": "appsmith",
          "traefik.http.routers.appsmith.tls.certresolver": "leresolver",
          "traefik.http.services.appsmith.loadbalancer.server.port": "80"
        },
        Mounts: [
          {
            Destination: "/appsmith-stacks",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/appsmith-stacks",
            Type: "bind"
          }
        ],
        Names: ["/appsmith"],
        NetworkSettings: {
          Networks: {
            br20_appnet: {
              Aliases: null,
              DriverOpts: null,
              EndpointID:
                "7d4fe81d1878d889ccca01dc3ce08e1e92885b398a63907ea79527a2c4931f34",
              Gateway: "172.20.0.1",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: {
                IPv4Address: "172.20.0.26"
              },
              IPAddress: "172.20.0.26",
              IPPrefixLen: 24,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "02:42:ac:14:00:1a",
              NetworkID:
                "96b7f1d0077cc89982c6150f9c3f83018e62ba07e97ac4be4aaa107333e196a9"
            }
          }
        },
        Portainer: {
          ResourceControl: {
            Id: 22,
            ResourceId: "2_br20_apps",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Ports: [
          {
            PrivatePort: 443,
            Type: "tcp"
          },
          {
            PrivatePort: 80,
            Type: "tcp"
          }
        ],
        State: "running",
        Status: "Up 3 days (healthy)"
      },
      {
        Command: "/usr/sbin/entrypoint.sh",
        Created: 1669209570,
        HostConfig: {
          NetworkMode: "br20_appnet"
        },
        Id: "e84197c12b7440e7c0c2e44d08846f3517a529968db57dfa338ba24fa34be74a",
        Image: "owntracks/recorder",
        ImageID:
          "sha256:e8ef290b852a5006e0bee04a5b984d561211c6f9ee06c39d758dbd0bd40f88b0",
        Labels: {
          "com.docker.compose.config-hash":
            "bbafce77c94794cfb7c0c66aa84fe37b462e25915108124dbbe10f0ed6093277",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.depends_on": "",
          "com.docker.compose.image":
            "sha256:e8ef290b852a5006e0bee04a5b984d561211c6f9ee06c39d758dbd0bd40f88b0",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "br20_apps",
          "com.docker.compose.project.config_files":
            "/data/compose/52/docker-compose.yml",
          "com.docker.compose.project.working_dir": "/data/compose/52",
          "com.docker.compose.service": "otrecorder",
          "com.docker.compose.version": "2.10.2"
        },
        Mounts: [
          {
            Destination: "/config",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/ot/rec/config",
            Type: "bind"
          },
          {
            Destination: "/store",
            Mode: "rw",
            Propagation: "rprivate",
            RW: true,
            Source: "/root/ot/rec/store",
            Type: "bind"
          }
        ],
        Names: ["/otrecorder"],
        NetworkSettings: {
          Networks: {
            br20_appnet: {
              Aliases: null,
              DriverOpts: null,
              EndpointID: "",
              Gateway: "",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: {
                IPv4Address: "172.20.0.54"
              },
              IPAddress: "",
              IPPrefixLen: 0,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "",
              NetworkID:
                "96b7f1d0077cc89982c6150f9c3f83018e62ba07e97ac4be4aaa107333e196a9"
            }
          }
        },
        Portainer: {
          ResourceControl: {
            Id: 22,
            ResourceId: "2_br20_apps",
            SubResourceIds: [],
            Type: 6,
            UserAccesses: [],
            TeamAccesses: [],
            Public: false,
            AdministratorsOnly: true,
            System: false
          }
        },
        Ports: [],
        State: "restarting",
        Status: "Restarting (14) 19 seconds ago"
      },
      {
        Command: "/portainer",
        Created: 1668291730,
        HostConfig: {
          NetworkMode: "default"
        },
        Id: "30dbf43b1fb9a91a8baaeefeb8ad0bf5a37516d8ae38b5b545c404c8dc840b02",
        Image: "portainer/portainer-ee:latest",
        ImageID:
          "sha256:43827526fad476021e283ecc7c254c6daab2a9d1ec3d7a20bd05461bbf855a39",
        IsPortainer: true,
        Labels: {},
        Mounts: [
          {
            Destination: "/data",
            Driver: "local",
            Mode: "z",
            Name: "portainer_data",
            Propagation: "",
            RW: true,
            Source: "/var/lib/docker/volumes/portainer_data/_data",
            Type: "volume"
          },
          {
            Destination: "/var/run/docker.sock",
            Mode: "",
            Propagation: "rprivate",
            RW: true,
            Source: "/var/run/docker.sock",
            Type: "bind"
          }
        ],
        Names: ["/portainer"],
        NetworkSettings: {
          Networks: {
            bridge: {
              Aliases: null,
              DriverOpts: null,
              EndpointID:
                "7ef926a5678020f903e36bca3fb0162b5b812e00e9e5368ccd942d6ac593e5e5",
              Gateway: "172.17.0.1",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              IPAMConfig: null,
              IPAddress: "172.17.0.2",
              IPPrefixLen: 16,
              IPv6Gateway: "",
              Links: null,
              MacAddress: "02:42:ac:11:00:02",
              NetworkID:
                "2f1abe608bf947c352ec8ca719571f044cf8675694e7cb0e28965d3df0104ff4"
            }
          }
        },
        Ports: [
          {
            IP: "0.0.0.0",
            PrivatePort: 8000,
            PublicPort: 8000,
            Type: "tcp"
          },
          {
            PrivatePort: 9000,
            Type: "tcp"
          },
          {
            IP: "0.0.0.0",
            PrivatePort: 9443,
            PublicPort: 9443,
            Type: "tcp"
          }
        ],
        State: "running",
        Status: "Up 3 days"
      }
    ],
    jsonata: "$",
    bindings: defaultBindingsText
  },
  Invoice: {
    json: {
      Account: {
        "Account Name": "Firefly",
        Order: [
          {
            OrderID: "order103",
            Product: [
              {
                "Product Name": "Bowler Hat",
                ProductID: 858383,
                SKU: "0406654608",
                Description: {
                  Colour: "Purple",
                  Width: 300,
                  Height: 200,
                  Depth: 210,
                  Weight: 0.75
                },
                Price: 34.45,
                Quantity: 2
              },
              {
                "Product Name": "Trilby hat",
                ProductID: 858236,
                SKU: "0406634348",
                Description: {
                  Colour: "Orange",
                  Width: 300,
                  Height: 200,
                  Depth: 210,
                  Weight: 0.6
                },
                Price: 21.67,
                Quantity: 1
              }
            ]
          },
          {
            OrderID: "order104",
            Product: [
              {
                "Product Name": "Bowler Hat",
                ProductID: 858383,
                SKU: "040657863",
                Description: {
                  Colour: "Purple",
                  Width: 300,
                  Height: 200,
                  Depth: 210,
                  Weight: 0.75
                },
                Price: 34.45,
                Quantity: 4
              },
              {
                ProductID: 345664,
                SKU: "0406654603",
                "Product Name": "Cloak",
                Description: {
                  Colour: "Black",
                  Width: 30,
                  Height: 20,
                  Depth: 210,
                  Weight: 2.0
                },
                Price: 107.99,
                Quantity: 1
              }
            ]
          }
        ]
      }
    },
    jsonata: "$sum(Account.Order.Product.(Price * Quantity))",
    bindings: defaultBindingsText
  },
  Address: {
    json: {
      FirstName: "Fred",
      Surname: "Smith",
      Age: 28,
      Address: {
        Street: "Hursley Park",
        City: "Winchester",
        Postcode: "SO21 2JN"
      },
      Phone: [
        {
          type: "home",
          number: "0203 544 1234"
        },
        {
          type: "office",
          number: "01962 001234"
        },
        {
          type: "office",
          number: "01962 001235"
        },
        {
          type: "mobile",
          number: "077 7700 1234"
        }
      ],
      Email: [
        {
          type: "office",
          address: ["fred.smith@my-work.com", "fsmith@my-work.com"]
        },
        {
          type: "home",
          address: ["freddy@my-social.com", "frederic.smith@very-serious.com"]
        }
      ],
      Other: {
        "Over 18 ?": true,
        Misc: null,
        "Alternative.Address": {
          Street: "Brick Lane",
          City: "London",
          Postcode: "E1 6RF"
        }
      }
    },
    jsonata: `{
  "name": FirstName & " " & Surname,
  "mobile": Phone[type = "mobile"].number
}`,
    bindings: defaultBindingsText
  },
  Schema: {
    json: {
      $schema: "http://json-schema.org/draft-04/schema#",
      required: ["Account"],
      type: "object",
      id: "file://input-schema.json",
      properties: {
        Account: {
          required: ["Order"],
          type: "object",
          properties: {
            Customer: {
              required: ["First Name", "Surname"],
              type: "object",
              properties: {
                "First Name": {
                  type: "string"
                },
                Surname: {
                  type: "string"
                }
              }
            },
            AccID: {
              type: "string"
            },
            Order: {
              items: {
                required: ["OrderID", "Product"],
                type: "object",
                properties: {
                  OrderID: {
                    type: "string"
                  },
                  Product: {
                    items: {
                      required: [
                        "ProductID",
                        "Product Name",
                        "Price",
                        "Quantity"
                      ],
                      type: "object",
                      properties: {
                        SKU: {
                          type: "string"
                        },
                        Description: {
                          type: "object",
                          properties: {
                            Width: {
                              type: "integer"
                            },
                            Depth: {
                              type: "integer"
                            },
                            Weight: {
                              type: "number"
                            },
                            Colour: {
                              type: "string"
                            },
                            Material: {
                              type: "string"
                            },
                            Height: {
                              type: "integer"
                            }
                          }
                        },
                        "Product Name": {
                          type: "string"
                        },
                        Price: {
                          type: "number"
                        },
                        Quantity: {
                          type: "integer"
                        },
                        ProductID: {
                          type: "integer"
                        }
                      }
                    },
                    type: "array"
                  }
                }
              },
              type: "array"
            },
            "Account Name": {
              type: "string"
            },
            Address: {
              required: ["Address Line 1", "City", "Postcode"],
              type: "object",
              properties: {
                "Address Line 1": {
                  type: "string"
                },
                "Address Line 2": {
                  type: "string"
                },
                Postcode: {
                  type: "string"
                },
                City: {
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    jsonata: "**.properties ~> $keys()",
    bindings: defaultBindingsText
  },
  Library: {
    json: {
      library: {
        books: [
          {
            title: "Structure and Interpretation of Computer Programs",
            authors: ["Abelson", "Sussman"],
            isbn: "9780262510875",
            price: 38.9,
            copies: 2
          },
          {
            title: "The C Programming Language",
            authors: ["Kernighan", "Richie"],
            isbn: "9780131103627",
            price: 33.59,
            copies: 3
          },
          {
            title: "The AWK Programming Language",
            authors: ["Aho", "Kernighan", "Weinberger"],
            isbn: "9780201079814",
            copies: 1
          },
          {
            title: "Compilers: Principles, Techniques, and Tools",
            authors: ["Aho", "Lam", "Sethi", "Ullman"],
            isbn: "9780201100884",
            price: 23.38,
            copies: 1
          }
        ],
        loans: [
          {
            customer: "10001",
            isbn: "9780262510875",
            return: "2016-12-05"
          },
          {
            customer: "10003",
            isbn: "9780201100884",
            return: "2016-10-22"
          },
          {
            customer: "10003",
            isbn: "9780262510875",
            return: "2016-12-22"
          }
        ],
        customers: [
          {
            id: "10001",
            name: "Joe Doe",
            address: {
              street: "2 Long Road",
              city: "Winchester",
              postcode: "SO22 5PU"
            }
          },
          {
            id: "10002",
            name: "Fred Bloggs",
            address: {
              street: "56 Letsby Avenue",
              city: "Winchester",
              postcode: "SO22 4WD"
            }
          },
          {
            id: "10003",
            name: "Jason Arthur",
            address: {
              street: "1 Preddy Gate",
              city: "Southampton",
              postcode: "SO14 0MG"
            }
          }
        ]
      }
    },
    jsonata: `library.loans@$L.books@$B[$L.isbn=$B.isbn].customers[$L.customer=id].{
  'customer': name,
  'book': $B.title,
  'due': $L.return
}`,
    bindings: defaultBindingsText
  },
  Bindings: {
    json: {
      angle: 60
    },
    jsonata: `$cosine(angle * $pi/180)

/*
JSONata can be extended by binding variables to external functions and values.
Expand the 'Bindings' panel to bind variables to Javascript code for use in your expression.
This is useful for experimenting with functions that are not built into JSONata.
*/`,
    bindings: `{
  pi: 3.1415926535898,
  cosine: Math.cos
}`
  }
};
