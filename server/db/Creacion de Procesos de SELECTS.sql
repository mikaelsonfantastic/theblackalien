
-- MOSTRAR TODAS las Estadisticas Desplegado
CREATE PROCEDURE GetAll_EstadisticasDesplegado(

)
BEGIN
  START TRANSACTION;
    
    SELECT
        est.titulo_estadistica,
        est.desc_estadistica,
        est.url_archivo,
        est.correo_electronico,
        est.hora_generar_estadistica,
        est.tipo_estadistica,
        est.ind_estadistica,
        est.tiempo_generar_estadistica,
        hist.fec_estadistica Historial
    FROM rel_hist_estadistica rhe
    JOIN estadisticas est On est.cod_estadistica = rhe.cod_estadistica
    JOIN historial_estadistica hist On hist.cod_hist_estadistica = rhe.cod_hist_estadistica;

COMMIT;
END;


-- MOSTRAR una Estadistica Desplegado
CREATE PROCEDURE GetOne_EstadisticasDesplegado(
    IN PI_cod_estadistica Int
)
BEGIN
  START TRANSACTION;
    
    SELECT
        est.titulo_estadistica,
        est.desc_estadistica,
        est.url_archivo,
        est.correo_electronico,
        est.hora_generar_estadistica,
        est.tipo_estadistica,
        est.ind_estadistica,
        est.tiempo_generar_estadistica,
        hist.fec_estadistica Historial
    FROM rel_hist_estadistica rhe
    JOIN estadisticas est On est.cod_estadistica = rhe.cod_estadistica
    JOIN historial_estadistica hist On hist.cod_hist_estadistica = rhe.cod_hist_estadistica
    WHERE rhe.cod_hist_estadistica = PI_cod_estadistica;

COMMIT;
END;


-- MOSTRAR TODAS las Estadisticas
CREATE PROCEDURE GetAll_Estadisticas(

)
BEGIN
  START TRANSACTION;
    
    SELECT
        *
    FROM rel_hist_estadistica rhe
    JOIN estadisticas est On est.cod_estadistica = rhe.cod_estadistica
    JOIN historial_estadistica hist On hist.cod_hist_estadistica = rhe.cod_hist_estadistica;

COMMIT;
END;


-- MOSTRAR una Estadistica
CREATE PROCEDURE GetOne_Estadisticas(
    IN PI_cod_estadistica Int
)
BEGIN
  START TRANSACTION;
    
    SELECT
        *
    FROM rel_hist_estadistica rhe
    JOIN estadisticas est On est.cod_estadistica = rhe.cod_estadistica
    JOIN historial_estadistica hist On hist.cod_hist_estadistica = rhe.cod_hist_estadistica
    WHERE rhe.cod_hist_estadistica = PI_cod_estadistica;

COMMIT;
END;

-- MOSTRAR TODAS los Reportes Desplegados
CREATE PROCEDURE GetAll_ReportesDesplegados(

)
BEGIN
  START TRANSACTION;
    
     SELECT
        est.titulo_reporte,
        est.desc_reporte,
        est.url_archivo,
        est.correo_electronico,
        est.hora_generar_reporte,
        est.tipo_reporte,
        est.ind_reporte,
        est.tiempo_generar_reporte,
        hist.fec_reporte fecha_historial_reporte
    FROM rel_hist_reportes rhe
    JOIN reportes est On est.cod_reporte = rhe.cod_reporte
    JOIN historial_reportes hist On hist.cod_historial_reporte = rhe.cod_historial_reporte;

COMMIT;
END;


-- MOSTRAR un Reporte Desplegado
CREATE PROCEDURE GetOne_ReportesDesplegados(
    IN PI_cod_reporte Int
)
BEGIN
  START TRANSACTION;
     SELECT
        est.titulo_reporte,
        est.desc_reporte,
        est.url_archivo,
        est.correo_electronico,
        est.hora_generar_reporte,
        est.tipo_reporte,
        est.ind_reporte,
        est.tiempo_generar_reporte,
        hist.fec_reporte fecha_historial_reporte
    FROM rel_hist_reportes rhe
    JOIN reportes est On est.cod_reporte = rhe.cod_reporte
    JOIN historial_reportes hist On hist.cod_historial_reporte = rhe.cod_historial_reporte
    WHERE rhe.cod_hist_reportes = PI_cod_reporte;
COMMIT;
END;


-- MOSTRAR TODAS los Reportes
CREATE PROCEDURE GetAll_Reportes(

)
BEGIN
  START TRANSACTION;
    
    SELECT
        *
    FROM rel_hist_reportes rhe
    JOIN reportes est On est.cod_reporte = rhe.cod_reporte
    JOIN historial_reportes hist On hist.cod_historial_reporte = rhe.cod_historial_reporte;

COMMIT;
END;

-- MOSTRAR un Reporte
CREATE PROCEDURE GetOne_Reportes(
    IN PI_cod_reporte Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM rel_hist_reportes rhe
    JOIN reportes est On est.cod_reporte = rhe.cod_reporte
    JOIN historial_reportes hist On hist.cod_historial_reporte = rhe.cod_historial_reporte
    WHERE rhe.cod_hist_reportes = PI_cod_reporte;
COMMIT;
END;

-- MOSTRAR un Reporte
CREATE PROCEDURE GetOne_ReportesSinDesplegar(
    IN PI_cod_reporte Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM reportes
    WHERE reportes.cod_reporte = PI_cod_reporte;
COMMIT;
END;


-- Mostrar todos Usuarios
CREATE PROCEDURE GetAll_Usuarios(
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM usuarios;
COMMIT;
END;

-- Mostrar un Usuario
CREATE PROCEDURE GetOne_Usuarios(
    IN PI_cod_usuario Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM usuarios
    WHERE cod_usuario = PI_cod_usuario;

COMMIT;
END;

-- Mostrar un Usuario por EMAIL
CREATE PROCEDURE GetOne_UsuariosPorEmail(
    IN PV_email Varchar(255)
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM usuarios
    WHERE correo_electronico = PV_email;

COMMIT;
END;



-- Mostrar Paises
CREATE PROCEDURE GetAll_Pais(
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM pais;

COMMIT;
END;


-- Mostrar un Pais
CREATE PROCEDURE GetOne_Pais(
    IN PI_cod_pais Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM pais
    WHERE cod_pais = PI_cod_pais;

COMMIT;
END;



-- Mostrar Departamentos
CREATE PROCEDURE GetAll_Departamento(
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM departamento;

COMMIT;
END;


-- Mostrar un Departamento
CREATE PROCEDURE GetOne_Departamento(
    IN PI_cod_depto Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM departamento
    WHERE cod_depto = PI_cod_depto;

COMMIT;
END;

-- Mostrar Municipios
CREATE PROCEDURE GetAll_Municipio(
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM municipio;

COMMIT;
END;


-- Mostrar un Municipios
CREATE PROCEDURE GetOne_Municipio(
    IN PI_cod_municipio Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM municipio
    WHERE cod_municipio = PI_cod_municipio;

COMMIT;
END;


-- Mostrar una Direccion Desplegada
CREATE PROCEDURE GetOne_DireccionDesplegada(
    IN PI_cod_direccion Int
)
BEGIN
  START TRANSACTION;
    SELECT
        dir.desc_direccion,
        mun.nom_municipio,
        dept.nom_depto,
        pai.nom_pais
    FROM direccion dir
    Join municipio mun On mun.cod_municipio = dir.cod_direccion
    Join departamento dept On dept.cod_depto = mun.cod_depto
    Join pais pai On pai.cod_pais = dept.cod_pais
    Where dir.cod_direccion = PI_cod_direccion;
COMMIT;
END;


-- Mostrar una Direccion
CREATE PROCEDURE GetOne_Direccion(
    IN PI_cod_direccion Int
)
BEGIN
  START TRANSACTION;
    SELECT
       *
    FROM direccion
    Where cod_direccion = PI_cod_direccion;
COMMIT;
END;

-- Mostrar una Telefono
CREATE PROCEDURE GetOne_Telefono(
    IN PI_cod_telefono Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM telefono
    WHERE cod_telefono = PI_cod_telefono;

COMMIT;
END;


-- Mostrar Empresas
CREATE PROCEDURE GetAll_Empresa(

)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM empresa;

COMMIT;
END;


-- Mostrar una Empresa
CREATE PROCEDURE GetOne_Empresa(
    IN PI_cod_empresa Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM empresa
    WHERE cod_empresa = PI_cod_empresa;

COMMIT;
END;

-- Mostrar Empresas Desplegada
CREATE PROCEDURE GetAll_EmpresaDesplegada(

)
BEGIN
  START TRANSACTION;
    SELECT
        emp.nom_empresa,
        emp.tip_empresa,
        dir.desc_direccion,
        mun.nom_municipio,
        dept.nom_depto,
        pai.nom_pais,
        tel.num_telefono
    FROM empresa emp
    Join direccion dir On dir.cod_direccion = emp.cod_direccion
    Join municipio mun On mun.cod_municipio = dir.cod_municipio
    Join departamento dept On dept.cod_depto = mun.cod_depto
    Join pais pai On pai.cod_pais = dept.cod_pais
    Join telefono tel On tel.cod_telefono = emp.cod_telefono;  

COMMIT;
END;


-- Mostrar una Empresa Desplegada
CREATE PROCEDURE GetOne_EmpresaDesplegada(
    IN PI_cod_empresa Int
)
BEGIN
  START TRANSACTION;
    SELECT
        emp.nom_empresa,
        emp.tip_empresa,
        dir.desc_direccion,
        mun.nom_municipio,
        dept.nom_depto,
        pai.nom_pais,
        tel.num_telefono
    FROM empresa emp
    Join direccion dir On dir.cod_direccion = emp.cod_direccion
    Join municipio mun On mun.cod_municipio = dir.cod_municipio
    Join departamento dept On dept.cod_depto = mun.cod_depto
    Join pais pai On pai.cod_pais = dept.cod_pais
    Join telefono tel On tel.cod_telefono = emp.cod_telefono
    WHERE emp.cod_empresa = PI_cod_empresa;
COMMIT;
END;


-- Mostrar Usuarios Completos
CREATE PROCEDURE GetAll_REL_UsuariosPersonas(
    
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM rel_usuarios_personas rup
    JOIN usuarios usr On usr.cod_usuario = rup.cod_usuario
    JOIN personas per On per.cod_per = rup.cod_per;

COMMIT;
END;


-- Mostrar un Usuario Completo
CREATE PROCEDURE GetOne_REL_UsuariosPersonas(
    IN PI_cod_user_per Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM rel_usuarios_personas rup
    JOIN usuarios usr On usr.cod_usuario = rup.cod_usuario
    JOIN personas per On per.cod_per = rup.cod_per
    WHERE rup.cod_user_per = PI_cod_user_per;

COMMIT;
END;


-- Mostrar Usuarios Completamente Desplegado
CREATE PROCEDURE GetAll_UsuariosDesplegados(
)
BEGIN
  START TRANSACTION;
    
    SELECT
         usr.nom_usuario,
        usr.pass_usuario,
        usr.img_usuario,
        usr.correo_electronico,
        usr.estado_usuario,
        usr.tip_usuario,
        per.nom_per,
        per.apell_per,
        per.sex_per,
        per.ind_civil,
        per.fec_nac,
        per.tip_per,
        per.fec_registro,
        dir.desc_direccion,
        mun.nom_municipio,
        dept.nom_depto
    FROM rel_usuarios_personas rup
    JOIN usuarios usr On usr.cod_usuario = rup.cod_usuario
    JOIN personas per On per.cod_per = rup.cod_per
    Join direccion dir On dir.cod_direccion = per.cod_direccion_casa
    Join municipio mun On mun.cod_municipio = dir.cod_direccion
    Join departamento dept On dept.cod_depto = mun.cod_depto;

COMMIT;
END;

-- Mostrar un Usuario Completamente Desplegado
CREATE PROCEDURE GetOne_UsuariosDesplegados(
    IN PI_cod_user_per Int
)
BEGIN
  START TRANSACTION;
    
    SELECT
        usr.nom_usuario,
        usr.pass_usuario,
        usr.img_usuario,
        usr.correo_electronico,
        usr.estado_usuario,
        usr.tip_usuario,
        per.nom_per,
        per.apell_per,
        per.sex_per,
        per.ind_civil,
        per.fec_nac,
        per.tip_per,
        per.fec_registro,
        dir.desc_direccion,
        mun.nom_municipio,
        dept.nom_depto,
        pai.nom_pais
    FROM rel_usuarios_personas rup
    JOIN usuarios usr On usr.cod_usuario = rup.cod_usuario
    JOIN personas per On per.cod_per = rup.cod_per
    Join direccion dir On dir.cod_direccion = per.cod_direccion_casa
    Join municipio mun On mun.cod_municipio = dir.cod_direccion
    Join departamento dept On dept.cod_depto = mun.cod_depto
    Join pais pai On pai.cod_pais = dept.cod_pais
    WHERE rup.cod_user_per = PI_cod_user_per;

COMMIT;
END;

-- Mostrar una Distribucion
CREATE PROCEDURE GetOne_Distribucion(
    IN PI_cod_distribucion Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM distribucion
    WHERE cod_distribucion = PI_cod_distribucion;

COMMIT;
END;

-- Mostrar una Distribucion por NumPlaca
CREATE PROCEDURE GetOne_DistribucionPorPlaca(
    IN PV_num_placa VarChar(50)
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM distribucion
    WHERE num_placa = PV_num_placa;

COMMIT;
END;


-- Mostrar  Distribuciones
CREATE PROCEDURE GetAll_Distribucion(
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM distribucion;

COMMIT;
END;


-- Mostrar una Marca
CREATE PROCEDURE GetOne_Marca(
    IN PI_cod_marca Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM marca
    WHERE cod_marca = PI_cod_marca;

COMMIT;
END;

-- Mostrar Marcas
CREATE PROCEDURE GetAll_Marca(
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM marca;

COMMIT;
END;


-- Mostrar Inventarios
CREATE PROCEDURE GetAll_Inventario(
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM inventario;

COMMIT;
END;


-- Mostrar un Inventario
CREATE PROCEDURE GetOne_Inventario(
    IN PI_cod_pro Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM inventario
    WHERE inventario.cod_pro = PI_cod_pro;

COMMIT;
END;

-- Mostrar un Inventario x Id Producto
CREATE PROCEDURE GetOne_InventarioPorIdProducto(
    IN PI_id_pro VarChar(30)
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM inventario
    WHERE inventario.id_pro = PI_id_pro;

COMMIT;
END;



-- Mostrar Pedidos
CREATE PROCEDURE GetAll_DetallePedido(
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM detalle_pedido;

COMMIT;
END;

-- Mostrar un Pedido
CREATE PROCEDURE GetOne_DetallePedido(
    IN PI_cod_pedido Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM detalle_pedido
    WHERE cod_pedido = PI_cod_pedido;

COMMIT;
END;


-- Mostrar Pedidos Desplegados
CREATE PROCEDURE GetAll_DetallePedidoDesplegado(
)
BEGIN
  START TRANSACTION;
    SELECT
        dtp.id_pro_pedido,
        dtp.cant_pedido,
        dtp.fec_preparacion,
        dtp.val_pedido,
        dtp.tip_pago,
        dist.num_placa,
        dist.tip_transporte,
        emp.nom_empresa,
        emp.tip_empresa,
        dir.desc_direccion DireccionEmpresa,
        mun.nom_municipio MunicipioEmpresa,
        depto.nom_depto DeptoEmpresa,
        pai.nom_pais PaisEmpresa
    FROM detalle_pedido dtp
    Join distribucion dist On dist.cod_distribucion = dtp.cod_distribucion
    Join empresa emp ON emp.cod_empresa = dtp.cod_empresa
    Join direccion dir On dir.cod_direccion = emp.cod_direccion
    Join municipio mun On mun.cod_municipio = dir.cod_municipio
    Join departamento depto On depto.cod_depto = mun.cod_depto
    Join pais pai On pai.cod_pais = depto.cod_pais
    Order By dtp.cod_pedido;

COMMIT;
END;


-- Mostrar Un pedido Desplegado
CREATE PROCEDURE GetOne_DetallePedidoDesplegado(
    IN PI_cod_pedido Int
)
BEGIN
  START TRANSACTION;
    SELECT
        dtp.id_pro_pedido,
        dtp.cant_pedido,
        dtp.fec_preparacion,
        dtp.val_pedido,
        dtp.tip_pago,
        dist.num_placa,
        dist.tip_transporte,
        emp.nom_empresa,
        emp.tip_empresa,
        dir.desc_direccion DireccionEmpresa,
        mun.nom_municipio MunicipioEmpresa,
        depto.nom_depto DeptoEmpresa,
        pai.nom_pais PaisEmpresa
    FROM detalle_pedido dtp
    Join distribucion dist On dist.cod_distribucion = dtp.cod_distribucion
    Join empresa emp ON emp.cod_empresa = dtp.cod_empresa
    Join direccion dir On dir.cod_direccion = emp.cod_direccion
    Join municipio mun On mun.cod_municipio = dir.cod_municipio
    Join departamento depto On depto.cod_depto = mun.cod_depto
    Join pais pai On pai.cod_pais = depto.cod_pais
    Where dtp.cod_pedido = PI_cod_pedido;
COMMIT;
END;


-- Mostrar REL_DetPedido_Inventario
CREATE PROCEDURE GetAll_REL_DetPedido_Inventario(
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM rel_detpedido_inventario;

COMMIT;
END;

-- Mostrar UN REL_DetPedido_Inventario
CREATE PROCEDURE GetOne_REL_DetPedido_Inventario(
    IN PI_cod_detpedido_inv Int
)
BEGIN
  START TRANSACTION;
    SELECT
        *
    FROM rel_detpedido_inventario
    Where cod_detpedido_inv = PI_cod_detpedido_inv;

COMMIT;
END;


-- Mostrar Rel_detpedido_inventario Desplegado
CREATE PROCEDURE GetAll_REL_DetallePedidoDesplegado(
)
BEGIN
  START TRANSACTION;
    SELECT
        dtp.id_pro_pedido,
        dtp.cant_pedido,
        dtp.fec_preparacion,
        dtp.val_pedido,
        dtp.tip_pago,
        dist.num_placa,
        dist.tip_transporte,
        emp.nom_empresa,
        emp.tip_empresa,
        dir.desc_direccion DireccionEmpresa,
        mun.nom_municipio MunicipioEmpresa,
        depto.nom_depto DeptoEmpresa,
        pai.nom_pais PaisEmpresa,
        inv.nom_pro,
        inv.unidad_pro,
        inv.pre_pro,
        inv.fec_elab,
        inv.fec_venc
    FROM rel_detpedido_inventario rdi
    Join detalle_pedido dtp On dtp.cod_pedido = rdi.cod_detpedido_inv    
    Join distribucion dist On dist.cod_distribucion = dtp.cod_distribucion
    Join empresa emp ON emp.cod_empresa = dtp.cod_empresa
    Join marca marc On marc.cod_marca = dtp.cod_marca    
    Join inventario inv On inv.cod_pro = rdi.cod_pro
    Join direccion dir On dir.cod_direccion = emp.cod_direccion
    Join municipio mun On mun.cod_municipio = dir.cod_municipio
    Join departamento depto On depto.cod_depto = mun.cod_depto
    Join pais pai On pai.cod_pais = depto.cod_pais;

COMMIT;
END;


-- Mostrar Un registro de Rel_detpedido_inventario Desplegado
CREATE PROCEDURE GetOne_REL_DetallePedidoDesplegado(
    IN PI_cod_detpedido_inv Int
)
BEGIN
  START TRANSACTION;
    SELECT
        dtp.id_pro_pedido,
        dtp.cant_pedido,
        dtp.fec_preparacion,
        dtp.val_pedido,
        dtp.tip_pago,
        dist.num_placa,
        dist.tip_transporte,
        emp.nom_empresa,
        emp.tip_empresa,
        dir.desc_direccion DireccionEmpresa,
        mun.nom_municipio MunicipioEmpresa,
        depto.nom_depto DeptoEmpresa,
        pai.nom_pais PaisEmpresa,
        inv.nom_pro,
        inv.unidad_pro,
        inv.pre_pro,
        inv.fec_elab,
        inv.fec_venc
    FROM rel_detpedido_inventario rdi
    Join detalle_pedido dtp On dtp.cod_pedido = rdi.cod_detpedido_inv    
    Join distribucion dist On dist.cod_distribucion = dtp.cod_distribucion
    Join empresa emp ON emp.cod_empresa = dtp.cod_empresa
    Join marca marc On marc.cod_marca = dtp.cod_marca    
    Join inventario inv On inv.cod_pro = rdi.cod_pro
    Join direccion dir On dir.cod_direccion = emp.cod_direccion
    Join municipio mun On mun.cod_municipio = dir.cod_municipio
    Join departamento depto On depto.cod_depto = mun.cod_depto
    Join pais pai On pai.cod_pais = depto.cod_pais
    WHERE rdi.cod_detpedido_inv = PI_cod_detpedido_inv;

COMMIT;
END;






-- qwe

