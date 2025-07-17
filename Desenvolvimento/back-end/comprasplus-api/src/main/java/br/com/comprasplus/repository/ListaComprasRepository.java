package br.com.comprasplus.repository;

import br.com.comprasplus.model.ListaCompras;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListaComprasRepository extends JpaRepository<ListaCompras, Long> {
    List<ListaCompras> findByUsuarioId(Long usuarioId);
}
