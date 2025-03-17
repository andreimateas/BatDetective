package com.example.demo.utils.converter;

import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;

@Component

public interface Converter <E, D> {
    E createFromDto(D dto);
    D createFromEntity(E entity);

    default List<E> createFromDtos(final Collection<D> dtos){
        return dtos.stream().map(this::createFromDto).toList();
    }
    default List<D> createFromEntities(final Collection<E> entities){
        return entities.stream().map(this::createFromEntity).toList();
    }
}