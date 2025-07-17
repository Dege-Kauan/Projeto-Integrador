package br.com.comprasplus.repository;

import br.com.comprasplus.model.ItemLista;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemListaRepository extends JpaRepository<ItemLista, Long> {
    List<ItemLista> findByListaId(Long listaId);
}
