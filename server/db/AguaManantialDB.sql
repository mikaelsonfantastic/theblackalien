
-- PAISES Y MAS

CREATE TABLE Pais(
   cod_pais Int Auto_Increment Primary Key,
   nom_pais VarChar(255) Not Null

)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;

CREATE TABLE Departamento(
   cod_depto Int Auto_Increment Primary Key,
   nom_depto VarChar(255) Not Null,
   cod_pais Int Not Null,
  
   Constraint Foreign Key `FK_Depto_Pais` (cod_pais) References  Pais (cod_pais) On Delete Cascade

)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;

CREATE TABLE Municipio(
   cod_municipio Int Auto_Increment Primary Key,
   nom_municipio VarChar(255) Not Null,
   cod_depto Int Not Null,
  
   Constraint Foreign Key `FK_Municipio_Depto` (cod_depto) References  Departamento (cod_depto) On Delete Cascade

)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;

CREATE TABLE Direccion(
   cod_direccion Int Auto_Increment Primary Key,
   desc_direccion VarChar(255) Not Null,
   cod_municipio Int Not Null,
  
   Constraint Foreign Key `FK_Direccion_Municipio` (cod_municipio) References  Municipio (cod_municipio) On Delete Cascade

)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;


-- TELEFONOS

CREATE TABLE Telefono(
   cod_telefono Int Auto_Increment Primary Key,
   num_telefono VarChar(30) Not Null,
   tip_telefono Enum('F','C') Not Null
  
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;


-- Historial Reportes
CREATE TABLE Historial_reportes(
  cod_historial_reporte BigInt Primary Key Auto_Increment,
  fec_reporte DateTime Default Now()
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;


-- Usuarios (POR SI ACASO hay que poner el campo 'correo_electronico' como 'UNIQUE')
Create Table Usuarios(
  cod_usuario Int Auto_Increment Primary Key,
  nom_usuario Varchar(255) Not Null,
  pass_usuario Varchar(255) Not Null,
  img_usuario Varchar(255) Default 'notfound' Not Null,
  correo_electronico Varchar(255) Not Null,
  estado_usuario Enum('Enabled', 'Disabled') Default 'Enabled' Not Null,
  tip_usuario Enum('User','Admin') Default 'User' Not Null
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;

-- Distribucion
Create Table Distribucion(
  cod_distribucion Int Auto_Increment Primary Key,
  num_placa VarChar(50) Not Null,
  tip_transporte VarChar(255) Not Null
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;


-- Marca
Create Table Marca(
  cod_marca Int Auto_Increment Primary Key,
  nom_marca VarChar(255) Not Null
  
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;


-- Inventario
Create Table Inventario(
  cod_pro Int Auto_Increment Primary Key,
  id_pro VarChar(30) Not Null,
  nom_pro VarChar(255) Not Null,
  unidad_pro Int Not Null,
  pre_pro Decimal(10,0) Not Null,
  fec_elab Date Default Now(),
  fec_venc Date Default Now()
  
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;


-- Reportes
CREATE TABLE Reportes(
    cod_reporte BigInt Auto_Increment Primary Key,
    titulo_reporte VarChar(255) Not Null,
    desc_reporte LongText Not Null,
    formato_reporte Enum('doc', 'html', 'xlsx', 'txt', 'text', 'pdf', 'png', 'jpg', 'jpeg') Not Null,
    url_archivo VarChar(255) Not Null,
    correo_electronico VarChar(255) Not Null,
    hora_generar_reporte Time Not Null,
    tipo_reporte Enum('Generado', 'Guardado') Not Null,
    ind_reporte Enum('Enabled', 'Disabled') Not Null,
    tiempo_generar_reporte Enum('Diariamente', 'Semanalmente', 'Mensualmente', 'Anualmente') Not Null,
    cod_usuario Int Not Null,

    Constraint Foreign Key `FK_Reportes_Usuarios` (cod_usuario) References usuarios (cod_usuario) On Delete Cascade

)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;



-- Estadisticas
CREATE TABLE Estadisticas(
    cod_estadistica Int Auto_Increment Primary Key,
    titulo_estadistica VarChar(255) Not Null,
    desc_estadistica LongText Not Null,
    formato_estadistica Enum('doc', 'html', 'xlsx', 'txt', 'text', 'pdf', 'png', 'jpg', 'jpeg') Not Null,
    url_archivo VarChar(255) Not Null,
    correo_electronico VarChar(255) Not Null,
    hora_generar_estadistica Time Not Null,
    tipo_estadistica Enum('Generado', 'Guardado') Not Null,
    ind_estadistica Enum('Enabled', 'Disabled') Not Null,
    tiempo_generar_estadistica Enum('Diariamente', 'Semanalmente', 'Mensualmente', 'Anualmente') Not Null,
    cod_usuario Int Not Null,

    Constraint Foreign Key `FK_Estadisticas_Usuarios` (cod_usuario) References usuarios (cod_usuario) On Delete Cascade
    
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;


-- Empresa
Create Table Empresa(
  cod_empresa Int Auto_Increment Primary Key,
  nom_empresa VarChar(255) Not Null,
  tip_empresa VarChar(255) Not Null,
  cod_direccion Int Not Null,
  cod_telefono Int Not Null,
  Constraint Foreign Key `FK_Empresa_Direccion` (cod_direccion) References Direccion (cod_direccion) On Delete Cascade,
  Constraint Foreign Key `FK_Empresa_Telefono` (cod_telefono) References Telefono (cod_telefono) On Delete Cascade
  
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;


-- REL_Hist_Reportes

CREATE TABLE REL_hist_reportes(
  cod_hist_reportes Int Auto_Increment Primary Key,
  cod_historial_reporte BigInt Not Null,
  cod_reporte BigInt Not Null,
  
  Constraint Foreign Key `FK_REL_HistReportes_HistorialReportes` (cod_historial_reporte) References Historial_reportes(cod_historial_reporte) On Delete Cascade,
  Constraint Foreign Key `FK_REL_HistReportes_Reportes` (cod_reporte) References Reportes(cod_reporte) On Delete Cascade
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;

-- Historial Estadistica
CREATE TABLE Historial_estadistica(
  cod_hist_estadistica BigInt Primary Key Auto_Increment,
  fec_estadistica Date Default Now()
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;


-- REL_hist_estadistica

CREATE TABLE REL_hist_estadistica(
  cod_hist_estadistica Int Auto_Increment Primary Key,
  cod_historial_estadistica BigInt Not Null,
  cod_estadistica Int Not Null,
  
  Constraint Foreign Key `FK_REL_HistEstadistica_HistorialEstadistica` (cod_historial_estadistica) References historial_estadistica(cod_hist_estadistica) On Delete Cascade,
  Constraint Foreign Key `FK_REL_HistEstadistica_Estadistica` (cod_estadistica) References estadisticas(cod_estadistica) On Delete Cascade
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;


-- Personas
Create Table Personas(
  cod_per Int Auto_Increment Primary Key,
  identidad_per VarChar(16) Not Null,
  nom_per VarChar(255) Not Null,
  apell_per VarChar(255) Not Null,
  sex_per Enum('F','M') Not Null,
  ind_civil Enum('S','C','D','V') Not Null,
  fec_nac Date Not Null,
  tip_per VarChar(255) Not Null,
  fec_registro DateTime Default Now(),
  -- Foraneas
  cod_direccion_casa Int Not Null,
  cod_telefono_persona Int Not Null,
  cod_empresa Int Not null,
  
  Constraint Foreign Key `FK_Personas_DireccionCasa` (cod_direccion_casa) References Direccion(cod_direccion) On Delete Cascade,
  Constraint Foreign Key `FK_Personas_TelefonoPersona` (cod_telefono_persona) References Telefono(cod_telefono) On Delete Cascade,
  Constraint Foreign Key `FK_Personas_Empresa` (cod_empresa) References Empresa(cod_empresa) On Delete Cascade
  
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;


-- REL_Usuarios_Personas
Create Table REL_Usuarios_Personas(
  cod_user_per Int Auto_Increment Primary Key,
  cod_usuario Int Not Null,
  cod_per Int Not Null,
  
  Constraint Foreign Key `FK_REL_UsuariosPersonas_Usuario` (cod_usuario) References Usuarios(cod_usuario) On Delete Cascade,
  Constraint Foreign Key `FK_REL_UsuariosPersonas_Personas` (cod_per) References Personas(cod_per) On Delete Cascade
 
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;


-- Detalle Pedido (Ventas)
Create Table Detalle_Pedido(
  cod_pedido Int Auto_Increment Primary Key,
  id_pro_pedido VarChar(30) Not Null,
  cant_pedido Int Not Null,
  fec_preparacion Date Default Now(),
  val_pedido Decimal(10, 0),
  tip_pago Enum('C', 'D', 'E'),
  cod_distribucion Int Not Null,
  cod_empresa Int Not Null,
  cod_marca Int Not Null,

  Constraint Foreign Key `FK_DetPedido_Distribucion` (cod_distribucion) References Distribucion(cod_distribucion) On Delete Cascade,
  Constraint Foreign Key `FK_DetPedido_Empresa` (cod_empresa) References Empresa(cod_empresa) On Delete Cascade,
  Constraint Foreign Key `FK_DetPedido_Marca` (cod_marca) References Marca(cod_marca) On Delete Cascade
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;


-- REL_DetPedido_Inventario
Create Table Rel_DetPedido_Inventario(
    cod_detpedido_inv Int Auto_Increment Primary Key,
    cod_pedido Int Not Null,
    cod_pro Int Not Null,

    Constraint Foreign Key `FK_DetPedidoInv_Pedido` (cod_pedido) References Detalle_Pedido(cod_pedido) On Delete Cascade,
    Constraint Foreign Key `FK_DetPedidoInv_Producto` (cod_pro) References Inventario(cod_pro) On Delete Cascade
)ENGINE = INNODB
CHARACTER SET UTF8
Collate UTF8_UNICODE_CI;








-- qwe
