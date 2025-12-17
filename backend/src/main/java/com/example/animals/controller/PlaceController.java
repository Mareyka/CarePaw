package com.example.animals.controller;

import com.example.animals.model.Place;
import com.example.animals.repository.PlaceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class PlaceController {

    private final PlaceRepository placeRepository;

    public PlaceController(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    @GetMapping
    public ResponseEntity<List<Place>> getAll() {
        return ResponseEntity.ok(placeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Place> create(@RequestParam String name) {
        Place place = new Place(name);
        Place saved = placeRepository.save(place);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Place> update(@PathVariable Long id, @RequestParam String name) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Place not found: " + id));
        place.setName(name);
        Place saved = placeRepository.save(place);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!placeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        placeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}


